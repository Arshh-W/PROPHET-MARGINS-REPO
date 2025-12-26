/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3D2F28',
        secondary: '#6B5D4F',
        accent: '#1A1614',
        beige: '#F5F1E6',
      },
    },
  },
  plugins: [],
}


