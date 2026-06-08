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
          black: 'rgb(var(--color-bg-content-rgb) / <alpha-value>)',
          dark: 'rgb(var(--color-bg-surface-rgb) / <alpha-value>)',
          gray: 'rgb(var(--color-bg-elevated-rgb) / <alpha-value>)',
          primary: 'rgb(var(--color-brand-primary-rgb) / <alpha-value>)',
          primaryHover: 'rgb(var(--color-brand-primaryHover-rgb) / <alpha-value>)',
          secondary: 'rgb(var(--color-brand-secondary-rgb) / <alpha-value>)',
          secondaryHover: 'rgb(var(--color-brand-secondaryHover-rgb) / <alpha-value>)',
          accent: 'rgb(var(--color-brand-accent-rgb) / <alpha-value>)',
        },
        // Semantic tokens para text/status sem depender do namespace brand
        theme: {
          text: 'rgb(var(--color-text-primary-rgb) / <alpha-value>)',
          'text-secondary': 'rgb(var(--color-text-secondary-rgb) / <alpha-value>)',
          'text-muted': 'rgb(var(--color-text-muted-rgb) / <alpha-value>)',
          surface: 'rgb(var(--color-bg-surface-rgb) / <alpha-value>)',
          error: 'rgb(var(--color-status-error-rgb) / <alpha-value>)',
          success: 'rgb(var(--color-status-success-rgb) / <alpha-value>)',
          warning: 'rgb(var(--color-status-warning-rgb) / <alpha-value>)',
          info: 'rgb(var(--color-status-info-rgb) / <alpha-value>)',
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
        'retro': '4px 4px 0px 0px var(--color-brand-primary)',
        'retro-dim': '4px 4px 0px 0px var(--color-border-default)',
        'retro-sm': '2px 2px 0px 0px var(--color-brand-primary)',
        'glow': '0 0 15px var(--color-glow-primary)',
        'glow-lg': '0 0 25px var(--color-glow-primary-lg)',
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
