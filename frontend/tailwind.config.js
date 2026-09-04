/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: 'rgb(var(--color-ivory-50) / <alpha-value>)',
          100: 'rgb(var(--color-ivory-100) / <alpha-value>)',
          200: 'rgb(var(--color-ivory-200) / <alpha-value>)',
          300: 'rgb(var(--color-ivory-300) / <alpha-value>)',
          400: 'rgb(var(--color-ivory-400) / <alpha-value>)',
        },
        ink: {
          900: 'rgb(var(--color-ink-900) / <alpha-value>)',
          700: 'rgb(var(--color-ink-700) / <alpha-value>)',
          600: 'rgb(var(--color-ink-600) / <alpha-value>)',
          500: 'rgb(var(--color-ink-500) / <alpha-value>)',
          400: 'rgb(var(--color-ink-400) / <alpha-value>)',
          300: 'rgb(var(--color-ink-300) / <alpha-value>)',
          200: 'rgb(var(--color-ink-200) / <alpha-value>)',
        },
        cobalt: {
          50: 'rgb(var(--color-cobalt-50) / <alpha-value>)',
          100: 'rgb(var(--color-cobalt-100) / <alpha-value>)',
          500: 'rgb(var(--color-cobalt-500) / <alpha-value>)',
          600: 'rgb(var(--color-cobalt-600) / <alpha-value>)',
          700: 'rgb(var(--color-cobalt-700) / <alpha-value>)',
        },
        retropink: {
          400: '#F075B8',
          500: '#E85AA5', // Personality accent
          600: '#D4388B',
        },
        softpurple: {
          400: '#8E7CE3',
          500: '#7561D8', // Personality accent
          600: '#5F48C4',
        },
        signal: {
          green: 'rgb(var(--color-signal-green) / <alpha-value>)',
          red: 'rgb(var(--color-signal-red) / <alpha-value>)',
          ochre: 'rgb(var(--color-signal-ochre) / <alpha-value>)',
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        editorial: ['"Newsreader"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
        pixel: ['"Press Start 2P"', 'monospace'],
      },
      boxShadow: {
        'retro-sm': '2px 2px 0px 0px var(--shadow-retro-color)',
        'retro': '3px 3px 0px 0px var(--shadow-retro-color)',
        'retro-lg': '4px 4px 0px 0px var(--shadow-retro-color)',
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        'editorial': '4px',
        'card': '6px',
      }
    },
  },
  plugins: [],
}
