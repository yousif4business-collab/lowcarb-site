/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        grape: '#482465',
        grapedeep: '#2E1543',
        lemon: '#F2EA4F',
        paper: '#FFFDF4',
        ink: '#2A1740',
        muted: '#75648A'
      },
      fontFamily: {
        display: ['"Baloo Bhaijaan 2"', 'Tajawal', 'sans-serif'],
        body: ['Tajawal', 'sans-serif'],
        fraunces: ['Fraunces', 'serif']
      },
      boxShadow: {
        pop: '0 24px 60px -24px rgba(72,36,101,.40)',
        card: '0 14px 34px -18px rgba(72,36,101,.35)'
      },
      keyframes: {
        floaty: {
          '0%,100%': { transform: 'translateY(0) rotate(var(--rot,0deg))' },
          '50%': { transform: 'translateY(-14px) rotate(var(--rot,0deg))' }
        }
      },
      animation: { floaty: 'floaty 7s ease-in-out infinite' }
    }
  },
  plugins: []
}
