/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: { 700: '#232a4a', 800: '#1a1f36', 900: '#0f1225' },
        park: { green: '#22c55e', yellow: '#eab308', red: '#ef4444', blue: '#3b82f6' }
      }
    }
  },
  plugins: []
};
