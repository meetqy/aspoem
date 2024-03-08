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
      style={{
        height: 1440,
        width: 1080,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#3d345a",
        color: "#fff",
      }}
    >
      {content.map((c, i) => {
        return (
          <div
            key={i}
            style={{
              fontSize: 112,
              display: "flex",
              marginTop: i === 0 ? "-10%" : 0,
            }}
          >
            {c}
          </div>
        );
      })}

      <div
        style={{
          marginTop: 132,
          fontSize: 36,
          color: "#d4ceea",
          display: "flex",
        }}
      >
        —— {poem.author.dynasty}·{poem.author.name}《{poem.title}》
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "7%",
          fontSize: 32,
          color: "#bbb",
        }}
      >
        aspoem.com
      </div>
    </div>
  );
};

export default DrawDefaultPreview;
