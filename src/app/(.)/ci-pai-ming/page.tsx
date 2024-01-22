import { Button } from "~/components/ui/button";
import { cn } from "~/utils";

const lists = [
  {
    title: "水调歌头",
    color: ["bg-red-500", "text-red-50", "text-red-100", "text-red-200"],
    description: "双调九十五字，前段九句四平韵，后段十句四平韵。",
  },
  {
    title: "水龙吟",
    color: [
      "bg-orange-500",
      "text-orange-50",
      "text-orange-100",
      "text-orange-200",
    ],
    description: "双调一百零二字，前阕四仄韵、后阕五仄韵，上去通押。",
  },
];

export default function Page() {
  return (
    <div className="py-8">
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
        <Button variant={"ghost"}>按字母排序</Button>
      </div>

      <div className="mt-4 grid grid-cols-1 space-y-2">
        {lists.map((item, i) => (
          <div
            key={i}
            className={cn(
              "group flex cursor-pointer items-center justify-between border-b py-4",
            )}
          >
            <div className="flex-1">
              <p className="text-2xl font-bold">{item.title}</p>
              <p className="text-muted-foreground">{item.description}</p>
            </div>

            <div className="flex h-full w-24 items-center justify-end">
              <div className="rounded-md bg-muted px-4 py-1 font-mono text-sm text-muted-foreground transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                32
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
