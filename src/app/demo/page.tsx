import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";

export default async function Page() {
  const tags = await api.tag.findMany.query({
    type: null,
    select: ["count", "name"],
  });

  const ziran = tags.filter((tag) => /自然景观|山|水/.test(tag.name));
  const jieri = tags.filter((tag) => /节/.test(tag.name));
  const qingan = tags.filter((tag) => /离别|友情|思念/.test(tag.name));
  const jijie = tags.filter((tag) => /春|夏|秋|冬/.test(tag.name));

  const temp = ziran.concat(jieri).concat(qingan).concat(jijie);

  // tags 中移除 temp
  const other = tags.filter((tag) => !temp.includes(tag));

  return (
    <div className="container max-w-screen-lg">
      <div className="grid grid-cols-2 gap-4 p-4">
        <div>
          <p className="mb-4 font-bold">自然景观</p>
          {ziran.map((tag) => (
            <Button
              key={tag.name}
              className="mb-2 mr-2 rounded-full bg-green-100 text-green-800 hover:bg-green-600 hover:text-green-100"
            >
              {tag.name}
              <sup className="ml-1 font-mono">{tag._count.poems}</sup>
            </Button>
          ))}
        </div>

        <div>
          <p className="mb-4 font-bold">节日</p>
          {jieri.map((tag) => (
            <Button variant={"outline"} key={tag.name} className="mb-2 mr-2">
              {tag.name}
              <sup className="ml-1 font-mono">{tag._count.poems}</sup>
            </Button>
          ))}
        </div>

        <div>
          <p className="mb-4 font-bold">情感</p>
          {qingan.map((tag) => (
            <Button variant={"outline"} key={tag.name} className="mb-2 mr-2">
              {tag.name}
              <sup className="ml-1 font-mono">{tag._count.poems}</sup>
            </Button>
          ))}
        </div>

        <div>
          <p className="mb-4 font-bold">季节</p>
          {jijie.map((tag) => (
            <Button variant={"outline"} key={tag.name} className="mb-2 mr-2">
              {tag.name}
              <sup className="ml-1 font-mono">{tag._count.poems}</sup>
            </Button>
          ))}
        </div>

        <div>
          <p className="mb-4 font-bold">其他</p>
          {other.map((tag) => (
            <Button variant={"outline"} key={tag.name} className="mb-2 mr-2">
              {tag.name}
              <sup className="ml-1 font-mono">{tag._count.poems}</sup>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
