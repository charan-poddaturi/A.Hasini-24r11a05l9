/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        danger: "#dc2626",
        primary: "#0f172a",
        accent: "#2563eb",
      },
    },
  },
  plugins: [],
};
