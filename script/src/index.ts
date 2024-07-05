import { createTangAuthor } from "./chinese-poetry";
import { strapi } from "./strapi";

async function main() {
  // 创建朝代
  // await genDynasties();
  // 创建唐诗作者
  await createTangAuthor();
}

main();
