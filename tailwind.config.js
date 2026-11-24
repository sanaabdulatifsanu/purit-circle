/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purity: {
          primary: '#123C32',      // Deep Emerald
          secondary: '#1B6B50',    // Forest Green
          accent: '#D5AE62',       // Premium Gold
          bg: '#F7F5EF',           // Warm Ivory
          card: '#FFFFFF',         // White
          text: '#202B27',         // Charcoal
          muted: '#78847D',        // Muted Grey
          success: '#21865A',      // Green
          warning: '#D99A32',      // Amber
          error: '#D9534F',        // Soft Red
          border: '#E2E9E3',       // Light Sage
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(18, 60, 50, 0.04), 0 1px 2px -1px rgba(18, 60, 50, 0.02)',
        card: '0 4px 6px -1px rgba(18, 60, 50, 0.05), 0 2px 4px -2px rgba(18, 60, 50, 0.03)',
        elevated: '0 10px 15px -3px rgba(18, 60, 50, 0.08), 0 4px 6px -4px rgba(18, 60, 50, 0.04)',
      }
    },
  },
  plugins: [],
}
