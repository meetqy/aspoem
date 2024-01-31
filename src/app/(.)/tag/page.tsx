import { Button } from "~/components/ui/button";
import { HeaderMain } from "~/components/ui/header";
import { api } from "~/trpc/server";

export default async function Page() {
  const tags = await api.tag.findMany.query({
    type: null,
    select: ["count", "name"],
  });

  const alreadysIndex: number[] = [];

  const filter = (reg: RegExp) => {
    return tags.filter((item, i) => {
      if (reg.test(item.name) && !alreadysIndex.includes(i)) {
        alreadysIndex.push(i);
        return true;
      }

      return false;
    });
  };

  const ziran = filter(/山|水|自然景观/);

  const jieri = filter(/节|年|时/);

  const qingan = filter(/思念|青春|友情/);

  const jijie = filter(/春|夏|秋|冬/);

  const other = tags.filter((_, i) => !alreadysIndex.includes(i));

  const TagItem = ({ name, data }: { name: string; data: typeof tags }) => {
    return (
      <div>
        <h2 prose-h2="">{name}</h2>
        <p prose-p="">
          {data.map(
            (item) =>
              item._count.poems > 0 && (
                <Button key={item.id} variant={"outline"} className="mb-2 mr-2">
                  {item.name}
                  <sup className="ml-1 font-mono">{item._count.poems}</sup>
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

      <main className="mt-8 space-y-8">
        <TagItem name="自然景观" data={ziran} />
        <TagItem name="节日" data={jieri} />
        <TagItem name="情感" data={qingan} />
        <TagItem name="季节" data={jijie} />
        <TagItem name="其他" data={other} />
      </main>
    </>
  );
}
