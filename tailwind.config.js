/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'coffee-bean': '#0d0106',
        'vivid-royal': '#3626a7',
        'glaucous': '#657ed4',
        'scarlet-fire': '#ff331f',
        'ghost-white': '#fbfbff',
      },
    },
  },
  plugins: [],
}
