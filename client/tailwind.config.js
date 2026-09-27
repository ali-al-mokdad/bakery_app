/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      colors: {
        cream: {
          50: '#fefaf5',
          100: '#fdf3e7',
          200: '#f9e6cf',
        },
        bakery: {
          50: '#fdf8f3',
          100: '#f9ecdd',
          200: '#f0d5b3',
          300: '#e4b781',
          400: '#d6944f',
          500: '#c17a37',
          600: '#a3612c',
          700: '#824c27',
          800: '#6b3f24',
          900: '#5a3620',
        },
        accent: {
          400: '#e0876a',
          500: '#d16b4c',
          600: '#b8543a',
        },
      },
      boxShadow: {
        soft: '0 4px 20px -4px rgba(90, 54, 32, 0.15)',
        card: '0 8px 30px -8px rgba(90, 54, 32, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.25s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
