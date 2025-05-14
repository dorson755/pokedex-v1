module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backdropBlur: {
        xs: '2px',
      },
      colors: {
        'pokemon-blue': '#3B4CCA',
        'pokemon-red': '#FF0000',
        'glass-white': 'rgba(255, 255, 255, 0.1)'
      },
    },
  },
  plugins: [],
}