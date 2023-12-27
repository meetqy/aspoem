import { type Config } from "tailwindcss";
import daisyui from "daisyui";
import typography from "@tailwindcss/typography";

export default {
  content: ["./src/**/*.tsx"],
  plugins: [typography, daisyui],
} satisfies Config;
