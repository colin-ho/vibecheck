/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        sunset: {
          dawn: '#FFF8F0',
          morning: '#FFE8D6',
          noon: '#FFDCC2',
          afternoon: '#FFCBA4',
          golden: '#FFB088',
          dusk: '#FF9B6A',
          twilight: '#FF8A5B',
        },
        'sunset-text': '#3b110c',
        'sunset-text-secondary': '#5d3d3a',
        // Brand accent colors
        lavender: '#bdb7fc',
        'sunset-accent': '#dd5013',
        'brand-red': '#da1c1c',
        cream: '#FFF8F0',
        dark: '#3b110c',
        // Additional palette colors
        coffee: '#a05f1a',
        cinnamon: '#8b372b',
        cocoa: '#5d3d3a',
      },
      letterSpacing: {
        tightest: '-0.03em',
      },
    },
  },
  plugins: [],
}
