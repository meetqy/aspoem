"use client";

import { useEffect } from "react";

const isSupportFontFamily = (f: string): boolean => {
  if (typeof f !== "string") {
    return false;
  }

  const h = "Arial";

  if (f.toLowerCase() === h.toLowerCase()) {
    return true;
  }

  const e = "a";
  const d = 100;
  const a = 100;
  const i = 100;

  const c = document.createElement("canvas");
  const b = c.getContext("2d");

  c.width = a;
  c.height = i;

  b!.textAlign = "center";
  b!.fillStyle = "black";
  b!.textBaseline = "middle";

  const g = (j: string): number[] => {
    b!.clearRect(0, 0, a, i);
    b!.font = `${d}px ${j}, ${h}`;
    b!.fillText(e, a / 2, i / 2);
    const k = b!.getImageData(0, 0, a, i).data;
    return Array.from(k).filter((l) => l !== 0);
  };

  return g(h).join("") !== g(f).join("");
};

export default function LoadFont() {
  useEffect(() => {
    if (
      !isSupportFontFamily("KaiTi") &&
      !isSupportFontFamily("Kaiti SC") &&
      !isSupportFontFamily("KaiTi_GB2312")
    ) {
      const css = `:root {
        --font-st-kaiti: "STKaiti";
      }
      
      @font-face {
        font-family: "STKaiti";
        src: url("/fonts/STKaiti.woff2") format("woff2");
      }
      
      .font-cursive {
        font-family: var(--font-st-kaiti);
      }
      `,
        head = document.head || document.getElementsByTagName("head")[0],
        style = document.createElement("style");

      head.appendChild(style);
      style.appendChild(document.createTextNode(css));
    }
  }, []);

  return null;
}
