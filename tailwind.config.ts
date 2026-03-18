import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        club: {
          navy: '#0A1628',
          'navy-light': '#1F2937',
          'navy-mid': '#1A2D4A',
          green: '#1B4332',
          'green-light': '#10B981',
          'green-dark': '#0B2520',
          gold: '#FBBF24',
          'gold-dark': '#D97706',
          glass: 'rgba(255, 255, 255, 0.05)',
          'glass-border': 'rgba(255, 255, 255, 0.1)',
          // Legacy compat
          forest: '#1B4332',
          'forest-light': '#2D6A4F',
          'forest-dark': '#0B2520',
          burgundy: '#6A1B38',
          'burgundy-light': '#8B2252',
          'burgundy-dark': '#4A1228',
          cream: '#0A1628',
          'cream-dark': '#0F1D32',
          'cream-light': '#152238',
          offwhite: '#0A1628',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        fadeIn: 'fadeIn 0.4s ease-in-out',
        fadeInUp: 'fadeInUp 0.5s ease-out',
        slideUp: 'slideUp 0.5s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s infinite',
        glow: 'pulseGlow 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(16,185,129,0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(16,185,129,0.6)' },
        },
      },
      backgroundImage: {
        'dark-gradient': 'linear-gradient(135deg, rgba(10,22,40,0.95) 0%, rgba(27,67,50,0.92) 100%)',
      },
    },
  },
  plugins: [],
}
export default config
