/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#07070B',
          900: '#0C0C13',
          800: '#14141E',
          700: '#1E1E2B',
          600: '#2A2A3A',
        },
        gold: {
          DEFAULT: '#E6AC17',
          light: '#F5C94E',
          dark: '#B8880F',
        },
        punch: {
          DEFAULT: '#ED3163',
          dark: '#C21F4D',
        },
        brand: {
          blue: '#0066FF',
          green: '#00974D',
          purple: '#442AD2',
        },
      },
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
