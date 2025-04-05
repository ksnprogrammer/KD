import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Knight Dragons - Embark on a Learning Quest" },
    { name: "description", content: "Gamified learning for Sri Lankan Grade 5 students." },
  ];
};

export default function Index() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-800 dark:via-gray-900 dark:to-black p-4">
      <div className="flex flex-col items-center gap-12 text-center">
        <header className="flex flex-col items-center gap-6">
           <img
            src="/logo-light.png" // Your Knight Dragons logo
            alt="Knight Dragons Logo"
            className="h-24 w-auto dark:hidden" // Adjust size as needed
          />
           <img
            src="/logo-dark.png" // Your Knight Dragons logo
            alt="Knight Dragons Logo"
            className="h-24 w-auto hidden dark:block" // Adjust size as needed
          />
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl">
            Welcome to Knight Dragons!
          </h1>
          <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Embark on a Learning Quest and conquer the Grade 5 Scholarship Exam.
          </p>
        </header>

        <div className="mt-6 flex items-center justify-center gap-x-6">
          <Link
            to="/login"
            className="rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="rounded-md bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          >
            Start Adventure <span aria-hidden="true">→</span>
          </Link>
        </div>

         {/* Optional: Add a small footer or more info */}
         <footer className="mt-10 text-center text-xs text-gray-500 dark:text-gray-400">
            Making learning fun for Grade 5 students in Sri Lanka.
         </footer>
      </div>
    </div>
  );
}
