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
          black: '#0D0D0D',          // Deep Obsidian
          dark: '#1A1A1A',           // Surface Dark
          gray: '#252525',           // Elevated
          primary: '#00FF41',        // Matrix Green
          primaryHover: '#33FF6A',   // Matrix Green lighter
          secondary: '#A0A0A0',      // Text Dim
          secondaryHover: '#F2F2F2', // Phosphor White
          accent: '#008F11',         // Primary Dim
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"VT323"', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0px',
        sm: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
        '2xl': '0px',
        '3xl': '0px',
        full: '0px',
      },
      boxShadow: {
        'retro': '4px 4px 0px 0px #00FF41',
        'retro-dim': '4px 4px 0px 0px #333333',
        'retro-sm': '2px 2px 0px 0px #00FF41',
        'glow': '0 0 15px rgba(0, 255, 65, 0.25)',
        'glow-lg': '0 0 25px rgba(0, 255, 65, 0.45)',
      },
      animation: {
        'blink': 'blinker 1s step-end infinite',
        'fade-in': 'fade-in 0.5s ease-out forwards',
      },
      keyframes: {
        'blinker': {
          '50%': { opacity: '0' },
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
