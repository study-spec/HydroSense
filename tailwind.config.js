
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],

  presets: [require("nativewind/preset")],

  darkMode: "class",

  theme: {
    extend: {
      colors: {
        aqua: "#079CC3",
        darkTeal: "#193B4C",
        lightBlue: "#F5FAFC",
        softBlue: "#E7F7FC",
      },
    },
  },

  plugins: [],
};
