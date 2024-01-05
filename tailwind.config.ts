import { type Config } from "tailwindcss";
import daisyui from "daisyui";
import typography from "@tailwindcss/typography";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        cursive: ["Comic Sans", "Comic Sans MS", "cursive"],
        pinyin: [
          "American Typewriter",
          "Andale Mono",
          "Courier New",
          "monospace",
        ],
      },
    },
  },
  plugins: [typography, daisyui],
} satisfies Config;
