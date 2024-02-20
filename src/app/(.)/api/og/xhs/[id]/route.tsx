import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { api } from "~/trpc/server";

export async function GET(
  _request: Request,
  { params }: { params: { id: string; slice: string } },
) {
  const poem = await api.poem.findById.query(Number(params.id));

  const url = new URL(_request.url);

  const slice = (url.searchParams
    .get("slice")
    ?.split(",") as unknown as number[]) || [0, 2];

  if (!poem) return notFound();

  const content = poem.content
    .replaceAll("\n", "")
    .match(/[^。|！|？|，|；]+[。|！|？|，|；]+/g)
    ?.slice(slice[0], slice[1]);

  if (!content || content.length === 0) return notFound();

  const kaiti = fetch(
    new URL(
      "/fonts/STKaiti.ttf",
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://aspoem.com",
    ),
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
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
            bottom: "10%",
            fontSize: 32,
            color: "#bbb",
          }}
        >
          现代化中国诗词学习网站
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
    ),
    {
      width: 1080,
      height: 1440,
      fonts: [
        {
          name: "kaiti",
          data: await kaiti,
        },
      ],
    },
  );
}
