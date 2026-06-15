/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        instagram: {
          blue: '#0095f6',
          grey: '#262626',
          lightGrey: '#efefef',
        }
      }
    },
  },
  plugins: [],
}
