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
  const result = await api.tag.findStatisticsById.query({
    id: Number(params.id),
    lang: params.lang,
  });

  if (!result) notFound();

  const data = result.data;

  const json: Record<string, (typeof data)[number][]> = {};
  data.forEach((item) => {
    const key = item.author.id;

    if (!json[key]) {
      json[key] = [];
    }

    json[key]!.push(item);
  });

  const statistics = Object.entries(json)
    .map(([_, value]) => value)
    .sort((a, b) => b.length - a.length);

  return new ImageResponse(
    (
      <div
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
        <p style={{ fontSize: 84, justifyContent: "center" }}>
          {result.tag.name}
        </p>

        <p
          style={{
            fontSize: 32,
            justifyContent: "center",
            opacity: 0.8,
          }}
        >
          {`${result.tag.type || "其他"}/${result.tag.name}，共${
            result.total
          }首，诗人${statistics.length}位`}
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
