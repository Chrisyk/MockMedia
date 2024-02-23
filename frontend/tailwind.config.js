const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    'node_modules/flowbite-react/lib/esm/**/*.js',
    
  ],
  theme: {
    extend: {
      animation: {
        'fade-in-out': 'fadeInOut 3s ease-in-out infinite',
      },
      variants: {
        extend: {
          brightness: ['hover'],
          borderColor: ['focus'],
          textColor: ['hover', 'active'],
        },
      },
      keyframes: {
        fadeInOut: {
          '0%': { opacity: '1' },
          '50%': { opacity: '0.5' },
          '100%': { opacity: '0' },
        },
      },
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.neutral,
      indigo: colors.indigo,
      red: colors.rose,
      yellow: colors.amber,
      lime: colors.lime,
      blue: colors.blue,
      purple: colors.violet,
      pink: colors.pink,
      green: colors.green,
      orange: colors.orange,
      teal: colors.teal,     

    }
  },
  plugins: [
    require('flowbite/plugin')
  ],
}