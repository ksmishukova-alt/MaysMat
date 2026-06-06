import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        lavender: {
          50: "#F8F4FF",
          100: "#F0E6FF",
          200: "#E4D4FF",
          300: "#C9B0FF",
        },
        brand: {
          purple: "#7C3AED",
          "purple-light": "#A78BFA",
          "purple-dark": "#5B21B6",
        },
      },
      borderRadius: {
        card: "1.25rem",
      },
      boxShadow: {
        card: "0 4px 24px rgba(124, 58, 237, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
