import { EyeIcon } from "lucide-react";
import Link from "next/link";
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
          <p className="prose-p text-secondary-foreground">
            词的一种制式曲调的名称，亦即唐宋时代经常用以填词的大致固定的一部分乐曲的原名，有固定的格式与声律，决定着词的节奏与音律。
          </p>
        </header>

        <div className="mt-8 grid grid-cols-1 space-y-4">
          {tags.map((item, i) => (
            <section
              key={i}
              className="group relative cursor-pointer justify-between rounded-md border border-border bg-card p-4 text-card-foreground transition-all hover:bg-accent hover:text-accent-foreground hover:shadow-md"
            >
              <div className="flex justify-between">
                <div className="w-full font-bold lg:w-3/5">
                  <Link
                    href={`/tag/list/${item.id}?page=1`}
                    className="underline-animation prose-h3 relative z-10 flex-1 text-primary"
                  >
                    {item.name}
                  </Link>
                </div>

                <div className="mt-1.5 flex font-mono text-xs font-normal text-muted-foreground/50">
                  <EyeIcon className="mr-1 h-4 w-4" />
                  <span>{item._count.poems}</span>
                </div>
              </div>

              <p className="mt-2 text-muted-foreground">{item.introduce}</p>

              <Link
                href={`/tag/list/${item.id}?page=1`}
                title="查看详情"
                className="pointer-events-auto absolute left-0 top-0 h-full w-full"
              />
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
