import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Golf Country Club Palette
        club: {
          forest: '#1B4332',
          'forest-light': '#2D6A4F',
          'forest-dark': '#0B2520',
          burgundy: '#6A1B38',
          'burgundy-light': '#8B2252',
          'burgundy-dark': '#4A1228',
          cream: '#F5F3EE',
          'cream-dark': '#E8E4DB',
          'cream-light': '#FAFAF8',
          gold: '#D4AF37',
          'gold-light': '#E8CC6E',
          'gold-dark': '#B8942E',
          navy: '#0A1628',
          'navy-light': '#152238',
          'navy-mid': '#1A2D4A',
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        fadeIn: 'fadeIn 0.4s ease-in-out',
        slideUp: 'slideUp 0.5s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s infinite',
        glow: 'glow 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(212,175,55,0.15)' },
          '50%': { boxShadow: '0 0 30px rgba(212,175,55,0.3)' },
        },
      },
      backgroundImage: {
        'leather': 'linear-gradient(135deg, rgba(27,67,50,0.95) 0%, rgba(10,22,40,0.95) 100%)',
        'wood': 'linear-gradient(180deg, rgba(27,67,50,0.08) 0%, rgba(212,175,55,0.04) 50%, rgba(27,67,50,0.08) 100%)',
      },
    },
  },
  plugins: [],
}
export default config