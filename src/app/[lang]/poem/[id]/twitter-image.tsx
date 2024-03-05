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

  const content = poem.content.split("\n").slice(0, 4);

  const isCenter = content.findIndex((line) => line.length <= 16) > -1;

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
        <p
          style={{
            fontSize: 72,
            display: "flex",
            justifyContent: "center",
            marginTop: -72,
          }}
        >
          {poem.title}
        </p>
        <p
          style={{
            fontSize: 24,
            display: "flex",
            justifyContent: "center",
            marginTop: -12,
            opacity: 0.7,
          }}
        >
          {poem.author.dynasty} · {poem.author.name}
        </p>

        {content.map((_, index) =>
          poem.genre === "诗" || isCenter ? (
            <p
              key={index}
              style={{
                fontSize: 36,
                width: "100%",
                opacity: 0.8,
                display: "flex",
                justifyContent: "center",
              }}
            >
              {_}
            </p>
          ) : (
            <p
              key={index}
              style={{
                fontSize: 36,
                width: "100%",
                opacity: 0.8,
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              <span style={{ opacity: 0 }}>啊</span>
              <span style={{ opacity: 0 }}>啊</span>
              {_.split("").map((item, i) => (
                <span key={i}>{item}</span>
              ))}
            </p>
          ),
        )}

        <p
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            opacity: 0.7,
            position: "absolute",
            bottom: 18,
            left: 32,
            fontSize: 16,
          }}
        >
          aspoem.com
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
