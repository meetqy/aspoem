import { api } from "~/trpc/server";
import "./index.css";
import { notFound } from "next/navigation";
import { type Author } from "@prisma/client";
import { cn } from "~/utils";

export default async function Page() {
  const { data } = await api.author.findMany.query({
    pageSize: 9,
  });

  if (data.length === 0) return notFound();

  const author1 = data[0];
  const author2 = data[1];
  const author3 = data[2];
  const author4 = data[3];
  const author5 = data[4];
  const author6 = data[5];
  const author7 = data[6];
  const author8 = data[7];
  const author9 = data[8];

  return (
    <div className="demo m-auto grid aspect-square h-[calc(100vh-2rem)] grid-cols-4 gap-4 overflow-hidden">
      <div className="group relative col-span-2 row-span-2 cursor-pointer transition-colors hover:bg-primary/80 hover:text-primary-foreground hover:backdrop-blur">
        <div className="absolute top-0 flex aspect-[5/2] w-full items-center justify-center overflow-hidden bg-gradient-to-tl from-blue-500 to-red-300 text-blue-50">
          <span className="-mt-4 text-9xl">{author1?.name}</span>
        </div>
        <div className="absolute bottom-0 aspect-[5/3] w-full overflow-hidden p-8">
          <p className="text-xl">{author1?.introduce}</p>
          <div className="mt-8 grid grid-cols-3">
            <div>
              <p className="font-mono text-4xl font-bold text-blue-500 group-hover:text-blue-400">
                {author1?._count.poems}
              </p>
              <p className="text-sm text-muted-foreground">作品</p>
            </div>
            <div>
              <p className="font-mono text-4xl font-bold">
                {author1?.birthDate && author1.deathDate
                  ? author1.deathDate - author1.birthDate
                  : "?"}
              </p>
              <p className="text-sm text-muted-foreground">享年</p>
            </div>
          </div>
          <p className="absolute bottom-4 right-4 w-full space-x-2 text-right text-sm text-muted-foreground">
            <span className="cursor-pointer hover:text-foreground hover:underline">
              #标签1
            </span>
            <span className="cursor-pointer hover:text-foreground hover:underline">
              #标签2
            </span>
            <span className="cursor-pointer hover:text-foreground hover:underline">
              #标签3
            </span>
          </p>
        </div>
      </div>
      <div>{author4 && <GridItemOne author={author4} />}</div>
      <div>{author5 && <GridItemOne author={author5} />}</div>
      <div>{author6 && <GridItemOne author={author6} />}</div>
      <div className="row-span-2">1</div>
      <div className="col-span-2">2</div>
      <div>{author7 && <GridItemOne author={author7} />}</div>
      <div>{author8 && <GridItemOne author={author8} />}</div>
      <div className="col-span-2">3</div>
      <div>{author9 && <GridItemOne author={author9} />}</div>
    </div>
  );
}

function GridItemOne({
  author,
}: {
  author: Author & { _count: { poems: number } };
}) {
  return (
    <div
      className={cn(
        "group absolute left-0 top-0 flex h-full w-full cursor-pointer items-center p-4",
      )}
    >
      <div className="absolute left-0 top-0 z-10 flex h-full w-full flex-col items-center justify-center bg-primary/80 text-primary-foreground opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
        <span className="font-mono text-xl capitalize">
          {author.namePinYin}
        </span>
        <span className="text-5xl">{author.name}</span>
      </div>

      <div className="relative aspect-square">
        <p className="mt-2 line-clamp-4">{author.introduce}</p>
        <div className="absolute bottom-4 grid w-full grid-cols-2">
          <div>
            <p className="font-mono text-3xl font-bold text-blue-500">
              {author._count.poems}
            </p>
            <p className="text-sm text-muted-foreground">作品</p>
          </div>
          <div>
            <p className="font-mono text-3xl font-bold">
              {author.birthDate && author.deathDate
                ? author.deathDate - author.birthDate
                : "?"}
            </p>
            <p className="text-sm text-muted-foreground">享年</p>
          </div>
        </div>
      </div>
    </div>
  );
}
