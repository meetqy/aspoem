import { genDynasties } from "./dynasy";
import { strapi } from "./strapi";

// strapi.GET("/poems/{id}");

async function main() {
  await genDynasties();
}

main();
