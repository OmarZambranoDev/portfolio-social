/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#344b33',
        'primary-hover': '#4a5d3e',
        secondary: '#7f886e',
        'secondary-hover': '#6b7359',
        accent: '#b78d6a',
        'accent-hover': '#a07d5c',
        muted: '#c5ae96',
        'muted-hover': '#d4bfa8',
        danger: '#b3423a',
        'danger-hover': '#96362f',
        earth: {
          forest: '#344b33',
          sand: '#b78d6a',
          stone: '#c5ae96',
          sage: '#7f886e',
          moss: '#4a5d3e',
          clay: '#a07d5c',
          warm: '#d4bfa8',
          rose: '#b3423a',
        },
      },
    },
  },
  plugins: [],
};
