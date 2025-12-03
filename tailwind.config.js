/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // This array tells Tailwind where to find class names.
    // Ensure this path covers all your React components, e.g., src/**/*.jsx, src/**/*.tsx, etc.
    "./",
    "./src/**/*.{js,ts,jsx,tsx}", // <--- CRITICAL LINE
  ],
  theme: {
    extend: {
      fontFamily: {
        // Setting 'Inter' or another font here makes it available to use
        // via the font-sans utility class.
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
