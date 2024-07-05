import { createTang } from "./chinese-poetry";
import { genDynasties } from "./dynasy";
import { strapi } from "./strapi";

async function main() {
  // await genDynasties();
  createTang();
}

main();
