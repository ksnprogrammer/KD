import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { supabase } from "~/lib/supabase";

export const meta: MetaFunction = () => {
  return [{ title: "Sign Up | Knight Dragons" }];
};

// Loader to check if user is already logged in
export async function loader({ request }: LoaderFunctionArgs) {
  // Placeholder - see login loader comments
  return json({});
}

// Action to handle signup form submission
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const username = formData.get("username") as string; // Get username

  // Basic validation
  if (!email || !password || !fullName || !username) {
    return json({ error: "All fields are required." }, { status: 400 });
  }
  if (password.length < 6) {
     return json({ error: "Password must be at least 6 characters long." }, { status: 400 });
  }
   if (username.length < 3) {
     return json({ error: "Username must be at least 3 characters long." }, { status: 400 });
  }
   // Add more validation as needed (e.g., username format)


  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Data to be passed to the trigger function (handle_new_user)
      // Ensure your trigger function uses these fields correctly
      data: {
        full_name: fullName,
        username: username, // Pass username here
        // avatar_url: 'default_avatar.png' // Optional: set a default avatar
        language_preference: 'si' // Default language
      },
      // Disable email confirmation for easier testing/development
      // In production, you'll likely want email confirmation enabled.
      // emailRedirectTo: `${new URL(request.url).origin}/login`, // Where to redirect after confirmation
    },
  });

   if (error) {
    console.error("Signup error:", error.message);
    // Check for specific errors like username already taken
    if (error.message.includes("duplicate key value violates unique constraint \"profiles_username_key\"")) {
       return json({ error: "Username already taken. Please choose another." }, { status: 409 }); // 409 Conflict
    }
     if (error.message.includes("User already registered")) {
       return json({ error: "An account with this email already exists." }, { status: 409 });
    }
    return json({ error: error.message || "Signup failed. Please try again." }, { status: 400 });
  }

   // Check if user exists but needs confirmation (if email confirmation is enabled)
   if (data.user && !data.session) {
     // This state occurs if email confirmation is required but not yet completed.
     // Redirect to a page informing the user to check their email.
     // return redirect("/check-email"); // Example redirect
     // For now, since confirmation is likely disabled, we redirect to login.
     return redirect("/login?message=Signup successful! Please log in.");
   }

  // If signup is successful and confirmation is not needed/completed instantly
  if (data.user && data.session) {
     // This usually happens when email confirmation is disabled.
     // The user is technically logged in, but let's redirect to login for consistency.
     return redirect("/login?message=Signup successful! Please log in.");
  }

  // Fallback redirect if something unexpected happens
  return redirect("/login?message=Signup complete. Please log in.");
}


export default function SignupPage() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-green-100 via-teal-100 to-cyan-100 dark:from-gray-800 dark:via-gray-900 dark:to-black p-4">
      <div className="w-full max-w-md rounded-lg bg-white dark:bg-gray-800 p-8 shadow-xl">
         <img
          src="/logo-light.png" // Assuming you have a logo
          alt="Knight Dragons"
          className="mx-auto mb-6 h-20 w-auto dark:hidden"
        />
         <img
          src="/logo-dark.png" // Assuming you have a logo
          alt="Knight Dragons"
          className="mx-auto mb-6 h-20 w-auto hidden dark:block"
        />
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800 dark:text-gray-100">
          Begin Your Quest!
        </h1>
        <Form method="post" className="space-y-4">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm"
            />
          </div>
           <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Username (min 3 chars)
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              minLength={3}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password (min 6 chars)
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
               minLength={6}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm"
            />
          </div>

          {actionData?.error && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {actionData.error}
            </p>
          )}

          <div>
            <button
              type="submit"
              className="mt-2 flex w-full justify-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Create Account
            </button>
          </div>
        </Form>
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400 dark:hover:text-teal-300"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
