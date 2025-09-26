/** @type {import('tailwindcss').Config} */

// const { rf } = require('./src/utils/responsiveFont');

module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ['./src/App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ff6464',
          50: '#fff1f1',
          100: '#ffe1e1',
          200: '#ffc7c7',
          300: '#ffa0a0',
          400: '#ff6464',
          500: '#f83b3b',
          600: '#e51d1d',
          700: '#c11414',
          800: '#a01414',
          900: '#841818',
          950: '#480707',
        },
        dark: '#4E4E4E',
        grey: '#9c9c9c',
        'grey-light': '#f4f4f4',
        error: '#dc2626',
        warning: '#d97706',
        success: '#2CCF8A',
        info: '#00B8F5',
        'primary-light': 'FFEAEA',
        'primary-dark': 'FF8282',
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'monospace'],
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
        128: '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        soft: '0 2px 8px 0 rgba(178, 178, 178, 0.1)',
        medium: '0 4px 12px 0 rgba(178, 178, 178, 0.1)',
        strong: '0 8px 24px 0 rgba(178, 178, 178, 0.1)',
      },
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.25rem',
      xl: '1.5rem',
      '2xl': '1.75rem',
      '3xl': '2rem',
      '4xl': '3rem',
      '5xl': '4rem',
      // xs: rf(10),
      // sm: rf(12),
      // md: rf(13),
      // base: rf(14),
      // lg: rf(18),
      // xl: rf(20),
      // '2xl': rf(24),
      // '3xl': rf(28),
    },
  },
  plugins: [],
};
