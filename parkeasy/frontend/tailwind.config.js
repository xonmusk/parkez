/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: { 600: '#111111', 700: '#0a0a0a', 800: '#050505', 900: '#000000' },
        park: { green: '#00ff41', yellow: '#ccff00', red: '#ff003c', blue: '#00ff41' },
        neon: { green: '#00ff41', dim: '#00cc33', dark: '#00661a', glow: '#00ff4133' }
      },
      boxShadow: {
        neon: '0 0 5px #00ff41, 0 0 20px #00ff4133',
        'neon-lg': '0 0 10px #00ff41, 0 0 40px #00ff4144',
        'neon-red': '0 0 5px #ff003c, 0 0 20px #ff003c33',
        'neon-yellow': '0 0 5px #ccff00, 0 0 20px #ccff0033',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      }
    }
  },
  plugins: []
};
