import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "学习古诗词 - aspoem.com";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0c0c0c",
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          color: "#fff",
        }}
      >
        <span style={{ fontSize: 196 }}>学习古诗词</span>
        <span style={{ fontSize: 72, opacity: 0.7 }}>aspoem.com</span>
      </div>
    ),
    size,
  );
}
