import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      spacing: {
        '5px': '5px'
      },
      colors: {
        'blackrose': '#241E20',
        'philippine-silver': '#B3B7BA',
        'charged-blue': '#28B7E1'
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        kanit: ['Kanit', 'sans-serif']
      }
    },
  },
  plugins: [],
} satisfies Config;
