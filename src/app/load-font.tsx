"use client";

import { useLayoutEffect } from "react";

export default function LoadFont() {
  useLayoutEffect(() => {
    const link = document.createElement("link");
    link.href = "/fonts/FZKai-Z03/result.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.innerHTML = `
      :root {
        --font-kaiti: "FZKai-Z03";
      }

      .font-cursive {
        font-family: var(--font-kaiti);
      }
     `;
    document.head.appendChild(style);
  }, []);

  return null;
}
