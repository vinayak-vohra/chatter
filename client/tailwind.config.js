import { light } from "./src/themes";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Playwrite: ["'Playwrite ES Deco'"],
      },
    },
  },
  daisyui: { themes: [{ light }] },
  plugins: [require("daisyui")],
};
