import Link from "next/link";
import { Button } from "~/components/ui/button";
import { HeaderMain } from "~/components/ui/header";
import { api } from "~/trpc/server";
import { cn } from "~/utils";

export async function generateMetadata() {
  return {
    title: `词牌名列表`,
  };
}

export default async function Page() {
  const tags = await api.tag.findMany.query({
    type: "词牌名",
    select: ["name", "introduce", "count"],
  });

  return (
    <>
      <HeaderMain>
        <div className="px-4">
          <span className="text-2xl font-bold">词牌名</span>
        </div>
      </HeaderMain>

      <div className="px-4 py-8">
        <header>
          <h1 prose-h1="">
            词牌名
            <span className="ml-1 font-mono text-xl font-normal">
              cí pái míng
            </span>
          </h1>
          <p prose-p="">
            词的一种制式曲调的名称，亦即唐宋时代经常用以填词的大致固定的一部分乐曲的原名，有固定的格式与声律，决定着词的节奏与音律。
          </p>
        </header>

        <div className="mt-12 flex space-x-2">
          <Button variant={"default"}>最受欢迎的</Button>
        </div>

        <div className="mt-4 grid grid-cols-1 space-y-2">
          {tags.map((item, i) => (
            <div
              key={i}
              className={cn(
                "group relative flex cursor-pointer items-center justify-between border-b border-border py-4",
              )}
            >
              <div className="flex-1">
                <p className="text-2xl font-bold">{item.name}</p>
                <p className="text-muted-foreground">{item.introduce}</p>
              </div>

              <div className="flex h-full w-24 items-center justify-end">
                <div className="rounded-md bg-muted px-4 py-1 font-mono text-sm text-muted-foreground transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                  {item._count.poems}
                </div>
              </div>

              <Link
                href={`/tag/list/${item.id}?page=1`}
                title="查看详情"
                className="pointer-events-auto absolute left-0 top-0 h-full w-full"
              ></Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
