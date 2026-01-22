/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        display: ["var(--font-display)", "ui-serif", "Georgia"],
      },
      colors: {
        ink: "#0b0f1a",
        parchment: "#f6f3ec",
        balance: "#0f7a4b",
        expense: "#b42318",
      },
      boxShadow: {
        soft: "0 12px 30px rgba(15, 23, 42, 0.12)",
      },
    },
  },
  plugins: [],
};
