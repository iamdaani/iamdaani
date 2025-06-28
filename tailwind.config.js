/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'var(--color-border)', // 👈 Add this
        ring: 'var(--color-ring)',     // Optional: also add ring if used
      },
    },
  },
  plugins: [],
}


