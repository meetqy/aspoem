import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "学习中国古诗词 - aspoem.com";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
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
        <p style={{ fontSize: 96, color: "rgb(250, 250, 250)" }}>滁州西涧</p>
        <p style={{ fontSize: 48, color: "rgb(161, 161, 170)" }}>
          独怜幽草涧边生，上有黄鹂深树鸣。{JSON.stringify(params)}
        </p>
        <p style={{ fontSize: 48, color: "rgb(161, 161, 170)" }}>
          春潮带雨晚来急，野渡无人舟自横。
        </p>
        <span
          style={{
            color: "rgb(37, 99, 235)",
            position: "absolute",
            right: 20,
            bottom: 20,
          }}
        >
          aspoem.com
        </span>
      </div>
    ),
    size,
  );
}
