/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
    "./src/utils/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette — exact hex values from the design system
        rust: {
          DEFAULT: "#AB4C35",
          dark: "#8B3D2F",
          light: "#C76A52",
        },
        cream: "#FEDCBD",
        neutral: {
          DEFAULT: "#DCDDDE",
        },
        ink: "#222222",
        muted: "#666666",
      },
      fontFamily: {
        sans: [
          "TT Norms Pro",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        display: [
          "White Oleander Upright",
          "Georgia",
          "serif",
        ],
      },
      fontSize: {
        h1: ["48px", { lineHeight: "1.1", fontWeight: "600" }],
        h2: ["36px", { lineHeight: "1.2", fontWeight: "600" }],
        h3: ["24px", { lineHeight: "1.3", fontWeight: "600" }],
      },
      boxShadow: {
        card: "0 6px 18px rgba(34, 34, 34, 0.08)",
        "card-hover": "0 16px 32px rgba(171, 76, 53, 0.2)",
      },
      borderRadius: {
        card: "12px",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pizzaSpin: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "pizza-spin": "pizzaSpin 2s linear infinite",
      },
      transitionTimingFunction: {
        bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};
