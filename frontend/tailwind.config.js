/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#090d16',
          secondary: '#0f1424',
          card: '#131b2e',
          elevated: '#1a233b',
        },
        primary: {
          DEFAULT: '#8b5cf6', // Violet
          hover: '#7c3aed',
          light: '#a78bfa',
          dark: '#6d28d9',
        },
        accent: {
          DEFAULT: '#3b82f6', // Blue
          hover: '#2563eb',
          light: '#60a5fa',
          cyan: '#06b6d4',
        },
        border: {
          subtle: '#1e293b',
          glow: 'rgba(139, 92, 246, 0.3)',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-purple': '0 0 30px -5px rgba(139, 92, 246, 0.3)',
        'glow-blue': '0 0 30px -5px rgba(59, 130, 246, 0.3)',
        'glow-cyan': '0 0 30px -5px rgba(6, 182, 212, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wave': 'wave 1.5s ease-in-out infinite',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'scaleY(0.4)' },
          '50%': { transform: 'scaleY(1)' },
        }
      }
    },
  },
  plugins: [],
}

