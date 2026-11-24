import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Crisp Neutrals & Stone
        stone: {
          950: "#121110", // Deep obsidian-stone body
          900: "#1a1816", // Warm charcoal surface
          850: "#22201d", // Elevated card panel
          800: "#2c2925", // Soft borders & dividers
          700: "#423d38", // Subtle borders
          600: "#635c54", // Muted metadata
          500: "#8a8176", // Secondary captions
          400: "#b5ac9f", // Body copy
          300: "#d6cec2", // Crisp neutral text
          200: "#e8e3d8", // Highlight text
          100: "#f4f0e6", // Parchment white
          50: "#faf8f2",  // Crisp pure linen
        },
        // Warm Earthy Tones
        clay: {
          600: "#a84a2d",
          500: "#c45b39", // Terracotta / warm brick primary accent
          400: "#db7553", // Warm clay hover
          300: "#e8997d",
          100: "#fbeee8",
        },
        amber: {
          earth: "#d48833", // Warm toasted amber
          sand: "#e3ad6a",  // Soft desert sand
        },
        sage: {
          earth: "#506555", // Forest / sage moss
          light: "#7b9481",
        },
        ochre: {
          warm: "#c9823b",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", '"Times New Roman"', "Times", "serif"],
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
        mono: [
          '"JetBrains Mono"',
          '"Fira Code"',
          "Menlo",
          "Consolas",
          '"Courier New"',
          "monospace",
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
