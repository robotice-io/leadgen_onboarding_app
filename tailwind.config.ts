import {heroui} from '@heroui/theme';
import type { Config } from 'tailwindcss'

// Minimal Tailwind config to enable class-based dark mode toggling
export default {
  darkMode: 'class',
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    // Scan HeroUI theme tokens and all component styles
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'color-1': 'hsl(var(--color-1))',
        'color-2': 'hsl(var(--color-2))',
        'color-3': 'hsl(var(--color-3))',
        'color-4': 'hsl(var(--color-4))',
        'color-5': 'hsl(var(--color-5))',
      },
      animation: {
        rainbow: 'rainbow var(--speed, 2s) infinite linear',
      },
      keyframes: {
        rainbow: {
          '0%': { 'background-position': '0%' },
          '100%': { 'background-position': '200%' },
        },
      },
    },
  },
  plugins: [heroui()],
} satisfies Config
