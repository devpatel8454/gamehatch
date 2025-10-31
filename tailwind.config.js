/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Gaming Color Palette
        'gaming': {
          'dark': '#1d1d1d',
          'primary': '#273b40',
          'secondary': '#3c4748',
          'accent': '#208c8c',
          'light': '#cae9ea',
        },
        // Semantic color names
        'primary': {
          50: '#f0fafa',
          100: '#cae9ea',
          200: '#95d3d5',
          300: '#60bdc0',
          400: '#2ba7ab',
          500: '#208c8c',
          600: '#1a7070',
          700: '#145454',
          800: '#0e3838',
          900: '#081c1c',
        },
        'dark': {
          50: '#e8e8e8',
          100: '#d1d1d1',
          200: '#a3a3a3',
          300: '#757575',
          400: '#474747',
          500: '#1d1d1d',
          600: '#171717',
          700: '#111111',
          800: '#0b0b0b',
          900: '#050505',
        },
        'teal-dark': {
          50: '#e9f2f3',
          100: '#d3e5e7',
          200: '#a7cbcf',
          300: '#7bb1b7',
          400: '#4f979f',
          500: '#273b40',
          600: '#1f2f33',
          700: '#172326',
          800: '#10171a',
          900: '#080c0d',
        },
      },
      backgroundImage: {
        'gaming-gradient': 'linear-gradient(135deg, #1d1d1d 0%, #273b40 50%, #3c4748 100%)',
        'gaming-accent': 'linear-gradient(135deg, #208c8c 0%, #3c4748 100%)',
        'gaming-glow': 'radial-gradient(circle at center, #208c8c 0%, #273b40 50%, #1d1d1d 100%)',
        'gaming-radial': 'radial-gradient(circle, #273b40 0%, #1d1d1d 100%)',
      },
      boxShadow: {
        'gaming': '0 0 20px rgba(32, 140, 140, 0.3)',
        'gaming-lg': '0 0 30px rgba(32, 140, 140, 0.4)',
        'gaming-xl': '0 0 40px rgba(32, 140, 140, 0.5)',
        'neon': '0 0 10px rgba(202, 233, 234, 0.5), 0 0 20px rgba(32, 140, 140, 0.3)',
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'monospace'],
        'rajdhani': ['Rajdhani', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
