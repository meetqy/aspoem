import { create, createSongCi } from "./chinese-poetry";

async function main() {
  // 创建唐
  // await create("tang", "唐");
  // // 创建宋
  // await create("song", "宋");
  // 创建宋词
  await createSongCi("宋");
}

main();
