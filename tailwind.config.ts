import type { Config } from 'tailwindcss'

// Minimal Tailwind config to enable class-based dark mode toggling
export default {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config
