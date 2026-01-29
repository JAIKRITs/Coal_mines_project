/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dashboard-bg': '#1e1e1e',
        'panel-bg': '#2d2d2d',
        'panel-border': '#404040',
      },
    },
  },
  plugins: [],
}

