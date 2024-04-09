import { random } from "lodash-es";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { type Locale } from "~/dictionaries";
import { api } from "~/trpc/server";

// Image generation
export default async function GET({
  params,
}: {
  params: { id: number; lang: Locale };
}) {
  const poem = await api.poem.findById.query({
    id: Number(params.id),
    lang: params.lang,
  });

  if (!poem) notFound();

  const contentTemp =
    poem.content
      .replaceAll("\n", "")
      .match(/[^。|！|？|，|；]+[。|！|？|，|；]+/g) || [];

  const endRandom: number[] = [];

  contentTemp.map((_, i) => {
    const index = i + 1;

    if (index % 2 === 0) endRandom.push(index);
  });

  const end = endRandom[random(0, endRandom.length - 1)] || 2;

  const content = contentTemp?.slice(end - 2, end) || [];

  console.log(content);

  return new ImageResponse(
    (
      <div
        lang="zh-Hans"
        style={{
          background: "#0c0c0c",
          color: "#fff",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 32,
          position: "relative",
          fontFamily: "cursive",
        }}
      >
        <p style={{ fontSize: 72, padding: "0 72px" }}>「{content[0]}</p>
        <p
          style={{
            fontSize: 72,
            padding: "0 72px",
            justifyContent: "flex-end",
          }}
        >
          {content[1]}」
        </p>
        <p
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            position: "absolute",
            opacity: 0.8,
            bottom: 18,
            left: 32,
            fontSize: 24,
          }}
        >
          aspoem
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
