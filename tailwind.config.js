/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        farm: {
          50: '#f2fbf4',
          100: '#e1f7e6',
          200: '#c5eed0',
          300: '#97deac',
          400: '#63c582',
          500: '#3ca860',
          600: '#2d874b',
          700: '#266b3d',
          800: '#225533',
          900: '#1e462c',
          950: '#0c2617',
        },
        earth: {
          50: '#faf7f2',
          100: '#f3ebe0',
          200: '#e6d5bf',
          300: '#d5b999',
          400: '#c29a73',
          500: '#b48156',
          600: '#a66e4b',
          700: '#8b573f',
          800: '#714637',
          900: '#5c3b2f',
        },
        harvest: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        }
      }
    },
  },
  plugins: [],
}
