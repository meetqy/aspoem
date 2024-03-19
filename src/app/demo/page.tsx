"use client";

import { api } from "~/trpc/react";
import { cn } from "~/utils";

export default function Page() {
  const { data } = api.tag.findById.useQuery({
    id: 99,
  });

  if (!data) return <div>Loading...</div>;

  const json: Record<number, (typeof data.data)[number][]> = {};
  data.data.forEach((item) => {
    if (!json[item.author.id]) {
      json[item.author.id] = [];
    }

    json[item.author.id]!.push(item);
  });

  const statistics = Object.entries(json)
    .map(([_, value]) => value)
    .sort((a, b) => b.length - a.length);

  const max = statistics[0]?.length || 0;

  const first = statistics[0]![0];

  return (
    <div className="flex max-w-screen-md space-x-4 overflow-auto p-4 text-xl">
      <div className="w-3/5 space-y-2 pr-4">
        {statistics.slice(0, 10).map((item, index) => {
          const poem = item[0]!;

          return (
            <div
              key={poem.author.id}
              className="relative flex h-12 items-center justify-between overflow-hidden rounded-md border border-border"
            >
              <div
                className={cn(
                  "flex h-full w-12 items-center justify-center font-serif",
                  {
                    "text-3xl text-destructive": index === 0,
                    " text-2xl text-orange-500": index === 1,
                    " text-green-500": index === 2,
                  },
                )}
              >
                {index + 1}
              </div>

              <div className="relative z-10 flex h-full flex-1 items-center">
                <div className="w-24 text-f100">{poem.author.name}</div>{" "}
                <div className="font-mono text-f50 capitalize text-muted-foreground">
                  {poem.author.namePinYin}
                </div>
              </div>

              <div className="flex h-full w-20 items-center justify-end pr-4 font-mono text-f50 text-muted-foreground">
                {item.length}
              </div>
              <div
                className={cn(
                  "absolute left-0 top-0 -z-10 h-full rounded-md bg-muted",
                )}
                style={{ width: (item.length / max) * 100 + "%" }}
              />
            </div>
          );
        })}
      </div>

      <div className="w-2/5">
        <h2 className="prose-h2">基本介绍</h2>
        <p className="prose-p !text-f50">
          由 Ned Walsh 于 一 九 九 二 年 春 陆 续 输 入。 当 时 他 是美 国
          Columbia 大 学 的 博 士 班 学 生。 他 断 断 续 续 地 学 习 了 十 年 的
          中 文，其 博 士 论 文 的 主 题 将 是 关 于 北 宋 时 期 的 词。 我 于
          该 年 春 末 将 全 文 校 正一 遍， 并 稍 改 Ned 的 格 式。 全 本 共 有
          三 百 又 二 十 首 诗， 原 由 蘅 塘 退 士选辑， 分为 六
          卷。作者：蘅塘退士，编 者：德山书生。
        </p>
        <h2 className="prose-h2">总结</h2>

        <p className="prose-p !text-f100">
          共收录了 <span className="font-mono font-medium">{data.total}</span>{" "}
          首诗，诗人{" "}
          <span className="font-mono font-medium">{statistics.length}</span>{" "}
          位。 其中，最多的诗人是 <b>{first!.author.name}</b>，共有{" "}
          <span className="font-mono font-medium">{max}</span> 首诗。
        </p>
      </div>
    </div>
  );
}
