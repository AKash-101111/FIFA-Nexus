/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-space': '#050816',
        'royal-blue': '#0F62FE',
        'electric-blue': '#3B82F6',
        'premium-purple': '#7C3AED',
        'cyan-accent': '#00C2FF',
        'deep-black': '#050816',
        'gold-accent': '#D4AF37', 
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
