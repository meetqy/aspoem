import { db } from "@/server/db";

export async function migrateDaiXuToSong() {
  console.log("开始迁移戴栩数据...");

  // 查找唐朝
  const tangDynasty = await db.dynasty.findFirst({
    where: { name: "唐" },
  });

  if (!tangDynasty) {
    console.error("未找到唐朝数据");
    return;
  }

  // 查找宋朝
  const songDynasty = await db.dynasty.findFirst({
    where: { name: "宋" },
  });

  if (!songDynasty) {
    console.error("未找到宋朝数据");
    return;
  }

  // 查找唐代戴栩
  const tangDaiXu = await db.author.findFirst({
    where: {
      name: "戴栩",
      dynastyId: tangDynasty.id,
    },
    include: {
      _count: {
        select: { poems: true },
      },
    },
  });

  if (!tangDaiXu) {
    console.log("未找到唐代戴栩");
    return;
  }

  console.log(`找到唐代戴栩，共有 ${tangDaiXu._count.poems} 首诗词`);

  // 查找或创建宋代戴栩
  let songDaiXu = await db.author.findFirst({
    where: {
      name: "戴栩",
      dynastyId: songDynasty.id,
    },
  });

  if (!songDaiXu) {
    console.log("创建宋代戴栩作者...");
    songDaiXu = await db.author.create({
      data: {
        name: tangDaiXu.name,
        pinyin: tangDaiXu.pinyin,
        dynastyId: songDynasty.id,
        introduce: tangDaiXu.introduce,
        slug: tangDaiXu.slug, // 添加缺失的 slug 字段
      },
    });
    console.log("✓ 已创建宋代戴栩");
  } else {
    console.log("宋代戴栩已存在");
  }

  // 更新所有唐代戴栩的诗词
  const result = await db.poem.updateMany({
    where: {
      authorId: tangDaiXu.id,
    },
    data: {
      authorId: songDaiXu.id,
      dynastyId: songDynasty.id,
    },
  });

  console.log(`✓ 已更新 ${result.count} 首诗词`);

  // 删除唐代戴栩（如果没有诗词了）
  const remainingPoems = await db.poem.count({
    where: { authorId: tangDaiXu.id },
  });

  if (remainingPoems === 0) {
    await db.author.delete({
      where: { id: tangDaiXu.id },
    });
    console.log("✓ 已删除唐代戴栩");
  }

  console.log("迁移完成！");
}
