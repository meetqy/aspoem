import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { api } from "~/trpc/server";

// Image generation
export async function GET(
  _request: Request,
  { params }: { params: { id: number } },
) {
  const poem = await api.poem.findById.query(Number(params.id));

  if (!poem) return notFound();

  const content = poem.content.split("。");

  return new ImageResponse(
    (
      <div
        lang="zh-CN"
        style={{
          background: "#0d0c0e",
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: "40px 80px",
          position: "relative",
        }}
      >
        <p style={{ fontSize: 96, color: "#fff" }}>{poem.title}</p>
        <p style={{ fontSize: 24, color: "#ddd", marginTop: -12 }}>
          {poem.author.dynasty}·{poem.author.name}
        </p>
        <p style={{ fontSize: 48, color: "#ddd" }}>{content[0]}。</p>
        <p style={{ fontSize: 48, color: "#ddd" }}>{content[1]}。</p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
