/* eslint-disable @next/next/no-css-tags */
"use client";

import Head from "next/head";
import { useLayoutEffect, useState } from "react";

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
  useLayoutEffect(() => {
    if (
      !isSupportFontFamily("KaiTi") &&
      !isSupportFontFamily("Kaiti SC") &&
      !isSupportFontFamily("KaiTi_GB2312")
    ) {
      const link = document.createElement("link");
      link.href = "/fonts/STKaiti/result.css";
      link.rel = "stylesheet";
      document.head.appendChild(link);

      const style = document.createElement("style");
      style.innerHTML = `
      :root {
        --font-st-kaiti: "STKaiti";
      }

      .font-cursive {
        font-family: var(--font-st-kaiti), cursive !important;
      }`;
      document.head.appendChild(style);
    }
  }, []);

  return null;
}
