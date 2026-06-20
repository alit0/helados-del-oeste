import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { red: '#E11B22', redDark: '#B3141A' },
        navy: '#16243F',
        cream: '#F6EFE7',
        cardWhite: '#FFFFFF',
        ink: '#1F2430',
        muted: '#6B7280',
      },
      borderRadius: { card: '1rem' },
      fontFamily: { sans: ['Nunito', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
} satisfies Config;
