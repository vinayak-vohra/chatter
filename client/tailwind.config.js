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
      animation: { shrink: "shrink 0.3s ease-in-out forwards" },
      keyframes: {
        shrink: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(0)" },
        },
      },
    },
  },
  daisyui: { themes: [{ light }] },
  plugins: [require("daisyui")],
};
