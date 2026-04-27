import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#1a1a1a",
        paper: "#fafaf7",
        muted: "#6b6b66",
        line: "#e5e3dc",
        accent: "#8b3a3a",
      },
      maxWidth: {
        prose: "640px",
        wide: "880px",
      },
    },
  },
  plugins: [],
};

export default config;
