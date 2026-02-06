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
        underground: {
          bg: "var(--underground-bg)",
          card: "var(--underground-card)",
          border: "var(--underground-border)",
          muted: "var(--underground-muted)",
          accent: "var(--underground-accent)",
          danger: "var(--underground-danger)",
          fg: "var(--underground-fg)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
