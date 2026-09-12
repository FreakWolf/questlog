import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ["var(--font-pixel)", "monospace"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      colors: {
        // Retro fantasy dungeon palette
        parchment: "#e8d9b5",
        ink: "#2b2013",
        dungeon: {
          950: "#0b0710",
          900: "#140d20",
          800: "#1e142f",
          700: "#2a1c42",
          600: "#3a2a5c",
        },
        gold: {
          DEFAULT: "#f5c542",
          dark: "#c99a1f",
          light: "#ffe08a",
        },
        mana: "#4aa3ff",
        health: "#ff5470",
        emerald: {
          glow: "#3ce88f",
        },
        rune: "#b48cff",
      },
      boxShadow: {
        pixel: "4px 4px 0 0 rgba(0,0,0,0.5)",
        "pixel-sm": "2px 2px 0 0 rgba(0,0,0,0.5)",
        glow: "0 0 20px rgba(180,140,255,0.5)",
        "glow-gold": "0 0 24px rgba(245,197,66,0.55)",
      },
      keyframes: {
        "level-pop": {
          "0%": { transform: "scale(0.6)", opacity: "0" },
          "50%": { transform: "scale(1.15)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "float-up": {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(-48px)", opacity: "0" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "pulse-glow": {
          "0%,100%": { boxShadow: "0 0 12px rgba(180,140,255,0.35)" },
          "50%": { boxShadow: "0 0 26px rgba(180,140,255,0.75)" },
        },
      },
      animation: {
        "level-pop": "level-pop 0.5s ease-out",
        "float-up": "float-up 1s ease-out forwards",
        shimmer: "shimmer 1.5s infinite",
        "pulse-glow": "pulse-glow 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
