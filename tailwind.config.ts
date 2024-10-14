import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        mono: ['var(--font-syne)'],
        sans: ['var(--font-dm-sans)'],
      },
      backgroundSize: {
        'size-200': '200% 200%',
      },
      backgroundPosition: {
        'pos-100': '0% 0%',
        'pos-50': '50% 50%',
        'pos-0': '100% 100%',
      },
      animation: {
        maskIn: 'fadeIn .5s ease-in-out forwards',
        maskOut: 'fadeOut .5s ease-in-out forwards',
      },
      keyframes: theme => ({
        fadeIn: {
          '0%': { 'background-color': theme.colors.transparent },
          '100%': { 'background-color': 'rgba(0, 0, 0, 0.3)' },
        },
        fadeOut: {
          '0%': { 'background-color': 'rgba(0, 0, 0, 0.3)' },
          '100%': { 'background-color': theme.colors.transparent },
        },
      })
    },
  },
  plugins: [],
};
export default config;
