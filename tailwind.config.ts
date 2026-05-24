import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        senegal: {
          green: '#00853f',
          yellow: '#fdef42',
          red: '#e31b23',
        },
      },
    },
  },
  plugins: [],
}
export default config
