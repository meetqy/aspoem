const ignore = ["□"];

import { globby } from "globby";
import path = require("path");

export async function createTang() {
  const files = await globby(path.join(__dirname, "./全唐诗/poet.tang.*.json"));

  console.log(files);
}
