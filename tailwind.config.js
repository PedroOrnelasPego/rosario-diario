/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#135bec",
          light: "#3b82f6",
          dark: "#1e3a8a",
        },
        background: {
          light: "#fbfcfd",
          dark: "#0f172a",
        },
        accent: {
          gold: "#d4af37",
          crimson: "#991b1b",
        },
        parchment: {
          DEFAULT: "#f4f1ea",
          dark: "#2a2d35",
        }
      },
      fontFamily: {
        display: ["Lexend", "sans-serif"],
        serif: ["Crimson Pro", "serif"],
      },
    },
  },
  plugins: [],
}
