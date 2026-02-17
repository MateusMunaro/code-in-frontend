/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#0A1929',          // Deep Void Blue
          dark: '#0F172A',           // Onyx Canvas
          gray: '#1E293B',           // Slate 800
          primary: '#00B4D8',        // Electric Cyan
          primaryHover: '#0096B7',   // Electric Cyan (darker)
          secondary: '#94A3B8',      // Technical Slate
          secondaryHover: '#CBD5E1', // Slate 300
          accent: '#38BDF8',         // Sky 400
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glow': '0 0 15px rgba(0, 180, 216, 0.25)',
        'glow-lg': '0 0 25px rgba(0, 180, 216, 0.45)',
        'glow-slate': '0 0 15px rgba(148, 163, 184, 0.2)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out forwards',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 15px rgba(0, 180, 216, 0.25)' },
          '50%': { boxShadow: '0 0 25px rgba(0, 180, 216, 0.5)' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
