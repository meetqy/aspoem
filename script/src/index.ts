import path = require("path");
import { create } from "./chinese-poetry";

async function main() {
  // // 创建唐
  // await create(
  //   path.join(__dirname, "./chinese-poetry/data/全唐诗/*.tang.*.json"),
  //   "唐"
  // );
  // // 创建宋
  // await create(
  //   path.join(__dirname, "./chinese-poetry/data/全唐诗/*.song.*.json"),
  //   "宋"
  // );
  // // 水墨唐诗
  // await create(
  //   path.join(__dirname, "./chinese-poetry/data/水墨唐诗/shuimotangshi.json"),
  //   "唐"
  // );
  // // 宋词
  // await create(
  //   path.join(__dirname, "./chinese-poetry/data/宋词/ci.song.*.json"),
  //   "宋",
  //   "rhythmic"
  // );
  // // 宋词三百首
  // await create(
  //   path.join(__dirname, "./chinese-poetry/data/宋词/宋词三百首.json"),
  //   "宋",
  //   "rhythmic"
  // );
  // // 纳兰性德
  // await create(
  //   path.join(__dirname, "./chinese-poetry/data/纳兰性德/*.json"),
  //   "清",
  //   "title",
  //   "para"
  // );
  // 五代
  await create(
    path.join(__dirname, "./chinese-poetry/data/五代诗词/**/*.json"),
    "五代",
    "rhythmic",
    "paragraphs"
  );
}

main();
