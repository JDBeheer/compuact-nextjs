import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#dfedff',
          200: '#b8dbff',
          300: '#7abfff',
          400: '#3a9ff5',
          500: '#1B6AB3',
          600: '#155d9e',
          700: '#124d84',
          800: '#11416d',
          900: '#13385b',
          950: '#0c243d',
        },
        accent: {
          50: '#fff8eb',
          100: '#feecc7',
          200: '#fdd78a',
          300: '#fcbe4d',
          400: '#fbab24',
          500: '#F49800',
          600: '#d87400',
          700: '#b35204',
          800: '#913f0a',
          900: '#78350b',
          950: '#451a03',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
