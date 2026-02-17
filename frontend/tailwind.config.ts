import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
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
        neon: {
          purple: "var(--neon-purple)",
          magenta: "var(--neon-magenta)",
          cyan: "var(--neon-cyan)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "neon-sm": "0 0 15px -3px var(--glow-purple)",
        "neon": "0 0 25px -5px var(--glow-purple)",
        "neon-cyan": "0 0 20px -5px var(--glow-cyan)",
      },
    },
  },
  plugins: [],
};

export default config;
