const path = require("path");

/** @type {import('tailwindcss').Config} */
module.exports = {
   content: [
      path.join(__dirname, "./stories/**/*.{js,ts,jsx,tsx}"),
      path.join(__dirname, "./.storybook/**/*.{js,ts,jsx,tsx}"),
      path.join(__dirname, "../../packages/ui/**/*.{js,ts,jsx,tsx}"),
   ],
   theme: {
      extend: {},
   },
   plugins: [],
};
