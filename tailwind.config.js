/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: '#000000',
        card: '#1c1c1e',
        card2: '#2c2c2e',
        sep: '#38383a',
        label2: '#8e8e93',
        accent: '#0a84ff',
        push: '#ff6b5b',
        pull: '#5ac8fa',
        legs: '#30d158',
        other: '#bf5af2',
      },
    },
  },
  plugins: [],
};
