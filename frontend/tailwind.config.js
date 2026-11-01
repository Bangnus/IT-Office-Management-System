// eslint-disable-next-line no-undef
const withMT = require("@material-tailwind/react/utils/withMT");

/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
const config = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["NotoThai", "system-ui", "sans-serif"],
        primaryRegular: ["regular"],
        primaryBold: ["bold"],
        primarySemibold: ["semibold"],
        primaryMedium: ["medium"],
      },
      colors: {
        // Brand blue, built around the system's original #074fad (brand-600)
        brand: {
          50: "#f1f6fd",
          100: "#dfe9f9",
          200: "#c0d4f4",
          300: "#8fb3ea",
          400: "#5a90de",
          500: "#2a6fd0",
          600: "#074fad",
          700: "#063f8a",
          800: "#08356f",
          900: "#0b2c58",
        },
        // Cool neutrals tinted toward the brand
        ink: {
          50: "#f6f8fb",
          100: "#eef2f7",
          200: "#dfe5ee",
          300: "#c6cfdc",
          400: "#8f9cb1",
          500: "#617089",
          600: "#4b586d",
          700: "#364256",
          800: "#232d3d",
          900: "#151c28",
        },
        primary: "#074fad",
        Footprimary: "#153599",
        secondery: "#98ded9",
        danger: "#d00000",
        textdanger: "#f37748",
        primaryofdashboard: "#116AEF",
      },
      boxShadow: {
        card: "0 1px 2px rgba(11,44,88,0.06), 0 1px 3px rgba(11,44,88,0.05)",
        pop: "0 12px 32px -8px rgba(11,44,88,0.22), 0 4px 10px -4px rgba(11,44,88,0.12)",
      },
      container: {
        center: true,
        padding: { default: "1rem", sm: "3rem" },
      },
    },
  },
  plugins: [
    // eslint-disable-next-line no-undef
    require("tailwindcss-animated"),
  ],
});

// Desktop-first: each breakpoint applies at that width AND BELOW (max-width).
// Set after withMT, whose theme merge reorders the keys to sm, md, lg, xl. The CSS follows this
// declaration order (largest first), so a smaller breakpoint overrides a larger one,
// e.g. "grid-cols-4 lg:grid-cols-2 sm:grid-cols-1".
config.theme.screens = {
  "2xl": { raw: "(max-width: 1535px)" },
  xl: { raw: "(max-width: 1279px)" },
  lg: { raw: "(max-width: 1023px)" },
  md: { raw: "(max-width: 767px)" },
  sm: { raw: "(max-width: 640px)" },
  xs: { raw: "(max-width: 412px)" },
};

// eslint-disable-next-line no-undef
module.exports = config;
