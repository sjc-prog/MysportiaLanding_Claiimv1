/** @type {import('tailwindcss').Config} */
// Palette = mysportia brand book + mysportia-marketplace-web-v3.html tokens
// (ink #0F1B3D · pink #FF3D7E · mint #16C25C · yellow #FFCB1F).
// Legacy utility names (gold/punch/brand-*) are kept but remapped to brand
// values so every component re-skins consistently.
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0F1B3D',
          900: '#14224a',
          800: '#1a2a56',
          700: '#263a6d',
          600: '#6B7077',
        },
        gold: {
          DEFAULT: '#FFCB1F',
          light: '#ffd543',
          dark: '#d8a800',
        },
        punch: {
          DEFAULT: '#FF3D7E',
          dark: '#e02765',
        },
        mint: {
          DEFAULT: '#16C25C',
          light: '#22d970',
        },
        paper: {
          DEFAULT: '#FFFFFF',
          2: '#FAFBFC',
          3: '#F1F3F6',
        },
        brand: {
          blue: '#263a6d',
          green: '#16C25C',
          purple: '#F0EBFF',
        },
      },
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        body: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
