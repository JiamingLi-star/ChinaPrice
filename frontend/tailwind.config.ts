import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#0f3460", light: "#1a4a8a", dark: "#0a2240" },
        accent: { DEFAULT: "#e94560", light: "#f06880", dark: "#c73450" },
        surface: { DEFAULT: "#f7f9fc", dark: "#1a1a2e" },
      },
    },
  },
  plugins: [],
};
export default config;
