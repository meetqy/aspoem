"use client";

import { useLayoutEffect } from "react";

export default function LoadFont() {
  useLayoutEffect(() => {
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
      }
     `;
    document.head.appendChild(style);
  }, []);

  return null;
}
