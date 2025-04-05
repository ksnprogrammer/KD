import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { supabase } from "~/lib/supabase";

export const meta: MetaFunction = () => {
  return [{ title: "Login | Knight Dragons" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  return json({});
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirectTo") as string) || "/";

  if (!email || !password) {
    return json({ error: "Email and password are required." }, { status: 400 });
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login error:", error.message);
    return json({ error: error.message || "Login failed. Please check your credentials." }, { status: 401 });
  }

  return redirect(redirectTo);
}


export default function LoginPage() {
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/";
  const message = searchParams.get("message"); // Get potential message from signup redirect

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background-light dark:bg-background-darker p-4">
      <div className="w-full max-w-sm rounded-lg bg-background dark:bg-background-dark p-8 shadow-2xl"> {/* Adjusted max-width and padding */}
        <img
          src="/logo-light.png"
          alt="Knight Dragons"
          className="mx-auto mb-6 h-20 w-auto dark:hidden"
        />
         <img
          src="/logo-dark.png"
          alt="Knight Dragons"
          className="mx-auto mb-6 h-20 w-auto hidden dark:block"
        />
        <h1 className="mb-6 text-center text-2xl font-bold text-text-DEFAULT dark:text-text-darker"> {/* Adjusted size */}
          Login to Your Quest
        </h1>

        {/* Display message from signup */}
        {message && (
          <div className="mb-4 rounded-md bg-green-100 dark:bg-green-900 p-3 text-center text-sm text-green-800 dark:text-green-200">
            {message}
          </div>
        )}

        <Form method="post" className="space-y-6">
           <input type="hidden" name="redirectTo" value={redirectTo} />
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-text-light dark:text-text-dark"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="input-field" // Use component class
              aria-describedby="email-error"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-text-light dark:text-text-dark"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="input-field" // Use component class
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
              className="btn btn-primary w-full" // Use component classes
            >
              Sign In
            </button>
          </div>
        </Form>
        <p className="mt-6 text-center text-sm text-text-light dark:text-text-dark">
          New Knight?{" "}
          <Link
            to="/signup"
            className="font-medium text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary"
          >
            Start your adventure!
          </Link>
        </p>
      </div>
    </div>
  );
}
