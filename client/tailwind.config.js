/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        rose: {
          DEFAULT: '#b76e79',
          light: '#d4a4b1', 
          dark: '#a15964',
        }
      }
    },
  },
  plugins: [],
}