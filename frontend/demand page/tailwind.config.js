/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F172A',
        secondary: '#475569',
        accent: '#000000',
        beige: '#F5F1E6',
      },
    },
  },
  plugins: [],
}
