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
    // Use a slightly more subtle gradient or a solid color from the theme
    <div className="flex min-h-screen flex-col items-center justify-center bg-background-light dark:bg-background-darker p-6">
      <div className="flex flex-col items-center gap-10 text-center max-w-2xl"> {/* Increased gap */}
        <header className="flex flex-col items-center gap-6">
           <img
            src="/logo-light.png"
            alt="Knight Dragons Logo"
            className="h-28 w-auto dark:hidden" // Slightly larger logo
          />
           <img
            src="/logo-dark.png"
            alt="Knight Dragons Logo"
            className="h-28 w-auto hidden dark:block" // Slightly larger logo
          />
          <h1 className="text-5xl font-bold tracking-tight text-text-DEFAULT dark:text-text-darker sm:text-6xl"> {/* Larger heading */}
            Welcome to Knight Dragons!
          </h1>
          <p className="mt-3 text-xl leading-8 text-text-light dark:text-text-dark"> {/* Larger paragraph */}
            Embark on a Learning Quest and conquer the Grade 5 Scholarship Exam.
          </p>
        </header>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6"> {/* Stack buttons on small screens */}
          <Link
            to="/login"
            className="btn btn-primary w-full sm:w-auto px-6 py-3 text-base" // Use component classes, adjust padding/text size
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="btn btn-secondary w-full sm:w-auto px-6 py-3 text-base" // Use component classes
          >
            Start Adventure <span aria-hidden="true">→</span>
          </Link>
        </div>

         <footer className="mt-12 text-sm text-text-light dark:text-text-dark"> {/* Increased margin */}
            Making learning fun for Grade 5 students in Sri Lanka.
         </footer>
      </div>
    </div>
  );
}
