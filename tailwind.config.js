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
          black: '#0a0a0a',
          dark: '#171717',
          gray: '#262626',
          primary: '#10b981',
          primaryHover: '#059669',
          secondary: '#8b5cf6',
          secondaryHover: '#7c3aed',
          accent: '#f59e0b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glow': '0 0 15px rgba(16, 185, 129, 0.3)',
        'glow-lg': '0 0 25px rgba(16, 185, 129, 0.5)',
        'glow-violet': '0 0 15px rgba(139, 92, 246, 0.3)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out forwards',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)' },
          '50%': { boxShadow: '0 0 25px rgba(16, 185, 129, 0.6)' },
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
