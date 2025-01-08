
// eslint-disable-next-line no-undef, no-unused-vars
const { propTypesId } = require("@material-tailwind/react/types/components/tabs");
// eslint-disable-next-line no-undef
const withMT = require("@material-tailwind/react/utils/withMT");

/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "path-to-your-node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "path-to-your-node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode:"class",
  theme: {
    extend: {
      fontFamily: {
        primaryRegular: ['regular'],
        primaryBold: ['bold'],
        primarySemibold: ['semibold'],
        primaryMedium: ['medium'],
      },
      colors: {
        // primary: "#118AB2",
        // secondery: "#06D6A0",
        primary: "#074fad",
        Footprimary: "#153599",
        secondery: "#98ded9",
        danger: "#d00000",
        textdanger: "#f37748",
        primaryofdashboard: "#116AEF",
      },
      container:{
        center:true,
        padding: {
          default:"1rem",
          sm:"3rem",
        }
      },
    },
    screens: {
      '2xl': { 'max': '1535px' },
      // => @media (max-width: 1535px) { ... }
      'xl': { 'max': '1279px' },
      // => @media (max-width: 1279px) { ... }
      'lg': { 'max': '1023px' },
      // => @media (max-width: 1023px) { ... }
      'md': { 'max': '767px' },
      // => @media (max-width: 767px) { ... }
      'sm': { 'max': '640px' },
      // => @media (max-width: 639px) { ... }
      'xs': { 'max': '412px'},
       // => @media (max-width: 410px) { ... }
    },
  },
  plugins: [
    // eslint-disable-next-line no-undef
    require('tailwindcss-animated')
  ],
});
