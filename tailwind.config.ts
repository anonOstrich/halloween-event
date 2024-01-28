import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'
import containerQueries from '@tailwindcss/container-queries'
import defaultTheme from 'tailwindcss/defaultTheme'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: 
      {
        'xs': '480px',
        ...defaultTheme.screens
      },
    extend: {
      colors: {
        "dark-primary-100":"#0085ff",
        "dark-primary-200" :"#69b4ff",
        "dark-primary-300": "#e0ffff",
        "dark-accent-100":"#006fff",
        // This is wonky
        "dark-accent-200":"#610fff",
        "dark-text-100":"#FFFFFF",
        "dark-text-200":"#9e9e9e",
        "dark-bg-100":"#1E1E1E",
        "dark-bg-200":"#2d2d2d",
        "dark-bg-300":"#454545",
        "primary-100":"#FF7F50",
        "primary-200" :"#dd6236",
        "primary-300": "#8f1e00",
        "accent-100":"#8B4513",
        "accent-200":"#ffd299",
        "text-100":"#000000",
        "text-200":"#2c2c2c",
        "bg-100":"#F7EEDD",
        "bg-200":"#ede4d3",
        "bg-300":"#c4bcab",
      }
    },
  },
  important: true,
  plugins: [
    typography,
    containerQueries
  ],
  darkMode: 'media'
}
export default config
