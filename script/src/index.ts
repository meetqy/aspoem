import path = require("path");
import { create, createNaLan, createSongCi } from "./chinese-poetry";

async function main() {
  // 创建唐
  // await create(path.join(__dirname, "./chinese-poetry/data/全唐诗/*.tang.*.json"), "唐");
  // 创建宋
  // await create(path.join(__dirname, "./chinese-poetry/data/全唐诗/*.song.*.json"), "宋");
  //
  await create(
    path.join(__dirname, "./chinese-poetry/data/水墨唐诗/shuimotangshi.json"),
    "唐"
  );
  // 创建宋词
  // await createSongCi("宋");
  // 创建那栏性德
  // await createNaLan("清");
}

main();
