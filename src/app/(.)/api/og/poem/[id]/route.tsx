import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { api } from "~/trpc/server";

// Image generation
export async function GET(
  _request: Request,
  { params }: { params: { id: number } },
) {
  const poem = await api.poem.findById.query(Number(params.id));

  const isDark = _request.url.includes("dark");

  if (!poem) return notFound();

  const content = poem.content.split(/。|！|？/);

  return new ImageResponse(
    (
      <div
        lang="zh-CN"
        style={{
          background: isDark ? "#09090b" : "#fff",
          color: isDark ? "#fff" : "#09090b",
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: "40px 40px",
        }}
      >
        <p style={{ fontSize: 96 }}>{poem.title}</p>
        <p style={{ fontSize: 32, marginTop: -12, opacity: 0.8 }}>
          {poem.author.dynasty}·{poem.author.name}
        </p>
        <p style={{ fontSize: 48, opacity: 0.9 }}>{content[0]}。</p>
        <p style={{ fontSize: 48, opacity: 0.9 }}>{content[1]}。</p>
        {
          <p
            style={{
              fontSize: 18,
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 40,
              opacity: 0.7,
            }}
          >
            《现代化中国诗词学习网站》
          </p>
        }
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
