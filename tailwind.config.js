import colors from './src/styles/theme/colors.js';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors (original names)
        'coffee-bean': colors['coffee-bean'],
        'vivid-royal': colors['vivid-royal'],
        'glaucous': colors['glaucous'],
        'scarlet-fire': colors['scarlet-fire'],
        'ghost-white': colors['ghost-white'],

        // Semantic aliases for easier usage
        'primary': colors.primary,
        'secondary': colors.secondary,
        'success': colors.success,
        'danger': colors.danger,
      },
    },
  },
  plugins: [],
}
