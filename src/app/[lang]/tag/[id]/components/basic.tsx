import { type Author, type Tag } from "@prisma/client";
import { cn } from "~/utils";

interface Props {
  data: {
    author: Author;
  }[][];
  total: number;
  tag: Tag;
}

export const TagBasic = (props: Props) => {
  const { data: statistics } = props;

  const max = statistics[0]?.length || 0;

  const first = statistics[0]![0];

  return (
    <div className="flex space-x-4 overflow-auto text-xl">
      <div className="w-3/5 space-y-4">
        {statistics.slice(0, 10).map((item, index) => {
          const poem = item[0]!;

          return (
            <div
              key={poem.author.id}
              className={cn(
                "relative flex h-12 items-center justify-between rounded-md border border-border",
              )}
            >
              <div
                className={cn(
                  "flex h-full w-12 items-center justify-center font-serif",
                  {
                    "text-3xl text-destructive": index === 0,
                    " text-2xl text-orange-500": index === 1,
                    "text-green-500": index === 2,
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

      <div className="flex w-2/5 flex-col justify-between space-y-4">
        <p className="prose-p flex-1 px-2 text-secondary-foreground">
          {props.tag.introduce}
        </p>

        <div className="px-2">
          <h2 className="prose-h2">统计</h2>
          <p className="prose-p !text-f100">
            共收录了{" "}
            <span className="font-mono font-medium">{props.total}</span>{" "}
            首诗，诗人{" "}
            <span className="font-mono font-medium">{statistics.length}</span>{" "}
            位。 其中，最多的诗人是 <b>{first!.author.name}</b>，共有{" "}
            <span className="font-mono font-medium">{max}</span> 首诗。
          </p>
        </div>
      </div>
    </div>
  );
};
