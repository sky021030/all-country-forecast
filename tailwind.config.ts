import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-noto-sans-jp)", "system-ui", "sans-serif"],
        display: ["var(--font-outfit)", "var(--font-noto-sans-jp)", "sans-serif"],
      },
      boxShadow: {
        card: "0 18px 50px -28px rgba(20, 48, 64, 0.26)",
      },
    },
  },
  plugins: [],
};

export default config;
