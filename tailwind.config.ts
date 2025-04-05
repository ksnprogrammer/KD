import type { Config } from "tailwindcss";
import defaultTheme from 'tailwindcss/defaultTheme'; // Import default theme

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'media', // Enable dark mode based on OS preference
  theme: {
    extend: {
      colors: {
        // Define a more vibrant palette inspired by games/fantasy
        primary: {
          light: '#60a5fa', // blue-400
          DEFAULT: '#3b82f6', // blue-600
          dark: '#2563eb', // blue-700
        },
        secondary: {
          light: '#4ade80', // green-400
          DEFAULT: '#22c55e', // green-600
          dark: '#16a34a', // green-700
        },
        accent: {
          light: '#facc15', // yellow-400
          DEFAULT: '#eab308', // yellow-500
          dark: '#ca8a04', // yellow-600
        },
        background: {
          light: '#f8fafc', // slate-50
          DEFAULT: '#ffffff', // white
          dark: '#1e293b', // slate-800
          darker: '#0f172a' // slate-900
        },
        text: {
          light: '#64748b', // slate-500
          DEFAULT: '#334155', // slate-700
          dark: '#cbd5e1', // slate-300
          darker: '#f1f5f9' // slate-100
        }
      },
      fontFamily: {
        // Keep Inter, but ensure sans includes fallbacks
        sans: ['"Inter"', ...defaultTheme.fontFamily.sans],
        // Optional: Add a more "fantasy" or "gaming" font if desired and available
        // display: ['"Your Gaming Font"', ...defaultTheme.fontFamily.sans],
      },
      // Add subtle animations or transitions if needed later
      // keyframes: { ... },
      // animation: { ... },
    },
  },
  plugins: [
     require('@tailwindcss/forms'), // Add forms plugin for better default form styling
  ],
} satisfies Config;
