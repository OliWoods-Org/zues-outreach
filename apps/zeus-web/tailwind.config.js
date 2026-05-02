/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        /* CoFounder ecosystem: void surfaces + blue + gold (glassmorphism-system) */
        siren: {
          black: '#050507',
          navy: '#080808',
          card: '#111113',
          /* Primary accent — CoFounder blue (was purple-tinted “blue”) */
          blue: '#4F8EF7',
          red: '#fb7185',
          border: 'rgba(255, 255, 255, 0.06)',
          muted: '#71717a',
          secondary: '#a1a1aa',
        },
        brand: {
          blue: '#4F8EF7',
          navy: '#3B7BF5',
          gold: '#D4A855',
          'gold-deep': '#C9A961',
        },
        void: '#050507',
      },
      spacing: {
        18: '4.5rem',
      },
      boxShadow: {
        railway: '0 0 0 1px rgba(255,255,255,0.06), 0 8px 40px rgba(0,0,0,0.45)',
        'railway-glow': '0 0 80px -20px rgba(167, 139, 250, 0.35)',
      },
    },
  },
  plugins: [],
};
