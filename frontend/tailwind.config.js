/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FCFAF6',
          100: '#FAF8F3', // Card background
          200: '#F3EFE5', // Main background
          300: '#E5DFD1', // Subtle border
          400: '#D6CEBC',
        },
        ink: {
          900: '#121212', // Primary text
          700: '#2A2A2A',
          600: '#4A4A4A', // Secondary text
          400: '#7A7A7A', // Muted captions
          200: '#B0B0B0',
        },
        cobalt: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          500: '#1746D1', // Primary brand accent
          600: '#1239B0',
          700: '#0E2D8F',
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
          green: '#176B52', // Positive market signal
          red: '#D94336',   // Negative market signal
          ochre: '#C58A1C', // Attention / unusual volume
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        editorial: ['"Newsreader"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
        pixel: ['"Press Start 2P"', 'monospace'],
      },
      boxShadow: {
        'retro-sm': '2px 2px 0px 0px #121212',
        'retro': '3px 3px 0px 0px #121212',
        'retro-lg': '4px 4px 0px 0px #121212',
        'subtle': '0 1px 3px 0 rgba(18, 18, 18, 0.05)',
      },
      borderRadius: {
        'editorial': '4px',
        'card': '6px',
      }
    },
  },
  plugins: [],
}
