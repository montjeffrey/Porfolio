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
        primary: "#E77D22", // Burnt Orange
        secondary: "#F0EDE4", // Soft Cream
        "bg-dark": "#0D0D0D",
        "bg-elevated": "#1A1A1A",
      },
      fontFamily: {
        serif: ["Georgia", "serif"],
        mono: ["'Courier New'", "monospace"],
        sans: ["system-ui", "-apple-system", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;

