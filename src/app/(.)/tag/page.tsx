import Link from "next/link";
import { Button } from "~/components/ui/button";
import { HeaderMain } from "~/components/ui/header";
import { api } from "~/trpc/server";

export default async function Page() {
  const tags = await api.tag.findMany.query({
    select: ["count", "name", "type"],
  });

  const types: {
    [key in string]: typeof tags;
  } = {};

  tags.map((item) => {
    const type = item.type || "其他";

    const temp = types[type] || [];
    temp.push(item);

    types[type] = temp;
  });

  const TagItem = ({ name, data }: { name: string; data?: typeof tags }) => {
    return (
      <div>
        <h2 prose-h2="">{name}</h2>
        <p prose-p="">
          {data?.map(
            (item) =>
              item._count.poems > 0 && (
                <Button
                  key={item.id}
                  variant={"secondary"}
                  className="mb-2 mr-2"
                  asChild
                >
                  <Link href={`/tag/list/${item.id}?page=1`}>
                    {item.name}
                    <sup className="ml-1 font-mono">{item._count.poems}</sup>
                  </Link>
                </Button>
              ),
          )}
        </p>
      </div>
    );
  };

  return (
    <>
      <HeaderMain>
        <div className="px-4">
          <span className="text-2xl font-bold">标签</span>
        </div>
      </HeaderMain>

      <main className="mt-4 space-y-8 p-4">
        {Object.keys(types).map((item) => (
          <TagItem key={item} name={item} data={types[item]} />
        ))}
      </main>
    </>
  );
}
