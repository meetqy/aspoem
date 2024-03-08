import { type Author, type Poem } from "@prisma/client";

interface Props {
  data: Poem & { author: Author };
}

const DrawDefaultPreview = (props: Props) => {
  const { data: poem } = props;

  const content =
    poem.content
      .replaceAll("\n", "")
      .match(/[^。|！|？|，|；]+[。|！|？|，|；]+/g)
      ?.slice(0, 2) || [];

  return (
    <div
      id="draw-share-card"
      className="relative h-[732px] w-[540px] bg-[#3d345a] p-6 text-white"
    >
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="-mt-12 w-full space-y-6">
          {content.map((c, i) => {
            return (
              <div key={i} className="w-full text-center text-6xl">
                {c}
              </div>
            );
          })}
        </div>

        <div className="mt-24 w-full text-end text-lg text-white/70">
          —— {poem.author.dynasty}·{poem.author.name}《{poem.title}》
        </div>
      </div>

      <div className="absolute bottom-6 left-0 w-full text-center text-white/50">
        aspoem
      </div>
    </div>
  );
};

export default DrawDefaultPreview;
