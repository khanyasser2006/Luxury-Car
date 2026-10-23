/** @type {i)`import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'black-green': '#020F06',
        'ruby-red': '#FA353F',
        'bg-base': '#020F06',
        'bg-surface': '#061F10',
        'bg-surface-hover': '#0A2E19',
        'ruby-base': '#FA353F',
        'ruby-glow': 'rgba(250, 53, 63, 0.4)',
        'ruby-subtle': 'rgba(250, 53, 63, 0.12)',
        'ruby-border': 'rgba(250, 53, 63, 0.3)',
        'ruby-hover': '#FF4A54',
        'text-primary': '#F5FAF7',
        'text-secondary': '#98AEA3',
        'text-tertiary': '#526A55',
        'border-subtle': 'rgba(152, 174, 163, 0.12)',
      },
      fontFamily: {
        display: ['Syncopate', 'sans-serif'],
        sans: ['"Exo 2"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'ruby-glow': '0 0 35px rgba(250, 53, 63, 0.35)',
        'ruby-glow-lg': '0 0 60px rgba(250, 53, 63, 0.45)',
        'dark-card': '0 25px 50px -12px rgba(2, 15, 6, 0.7)',
        'card-elevated': '0 20px 40px -15px rgba(0, 0, 0, 0.8)',
      },
      transitionTimingFunction: {
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'telemetry': 'cubic-bezier(0.25, 1, 0.5, 1)',
        'micro-spring': 'cubic-bezier(0.34, 1.25, 0.64, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translate3d(0, 8px, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        modalScale: {
          '0%': { opacity: '0', transform: 'scale(0.96) translate3d(0, 10px, 0)' },
          '100%': { opacity: '1', transform: 'scale(1) translate3d(0, 0, 0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 8px rgba(250, 53, 63, 0.6))' },
          '50%': { opacity: '0.6', filter: 'drop-shadow(0 0 2px rgba(250, 53, 63, 0.2))' },
        },
      },
      animation: {
        'fadeIn': 'fadeIn 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'modalScale': 'modalScale 280ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulseGlow': 'pulseGlow 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
