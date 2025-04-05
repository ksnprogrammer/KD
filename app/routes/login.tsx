import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { supabase } from "~/lib/supabase"; // Assuming supabase client is correctly set up

export const meta: MetaFunction = () => {
  return [{ title: "Login | Knight Dragons" }];
};

// Loader to check if user is already logged in
export async function loader({ request }: LoaderFunctionArgs) {
  // This is a placeholder. Proper session handling needed.
  // For now, we assume if they reach login, they aren't logged in server-side.
  // A real implementation would check for a valid session cookie.
  return json({});
}

// Action to handle login form submission
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirectTo") as string) || "/"; // Default redirect

  if (!email || !password) {
    return json({ error: "Email and password are required." }, { status: 400 });
  }

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login error:", error.message);
    return json({ error: error.message || "Login failed. Please check your credentials." }, { status: 401 });
  }

  // IMPORTANT: Supabase client handles session persistence client-side (localStorage).
  // For SSR/server actions, proper session management (e.g., cookies) is crucial.
  // This basic example relies on client-side redirection after successful login.
  // A more robust solution involves setting session cookies server-side.

  // Redirect on success - client-side will pick up the session
  // In a real app, you'd set session headers here before redirecting.
  return redirect(redirectTo);
}


export default function LoginPage() {
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-800 dark:via-gray-900 dark:to-black p-4">
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
          Login to Your Quest
        </h1>
        <Form method="post" className="space-y-6">
           <input type="hidden" name="redirectTo" value={redirectTo} />
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
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              aria-describedby="email-error"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              aria-describedby="password-error"
            />
          </div>

          {actionData?.error && (
            <p className="text-sm text-red-600 dark:text-red-400" id="password-error">
              {actionData.error}
            </p>
          )}

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Sign In
            </button>
          </div>
        </Form>
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          New Knight?{" "}
          <Link
            to="/signup"
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Start your adventure!
          </Link>
        </p>
      </div>
    </div>
  );
}
