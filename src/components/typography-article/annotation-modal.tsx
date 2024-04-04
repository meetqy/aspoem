"use client";

import { useEffect } from "react";

export const AnnotationModal = ({
  annotation,
}: {
  annotation: Record<string, string>;
}) => {
  useEffect(() => {
    const mainBody = document.querySelector("#main-body")!;
    const bodyPos = mainBody.getBoundingClientRect();
    const maxLeft = bodyPos.left + bodyPos.width - 256;

    const fn = (e: Event) => {
      const target = e.target as HTMLElement;
      const BTarget =
        target.tagName === "B" ? target : (target.offsetParent as HTMLElement);
      const Btext = BTarget.innerText.match(/[\u4e00-\u9fa5]/g)?.join("") || "";

      if (BTarget.tagName === "B" && Btext) {
        const pos = target.getBoundingClientRect();

        const div = document.createElement("div");
        div.id = "annotation-box";
        div.setAttribute(
          "style",
          `position: fixed;width: 100vw;height: 100vh;top: 0;left: 0;z-index: 100;`,
        );

        div.addEventListener("click", (e) => {
          const target = e.target as HTMLElement;
          if (target.id === "annotation-box") {
            div.remove();
          }
        });

        const x = pos.x > maxLeft ? maxLeft : pos.x;

        div.setAttribute("data-text", Btext);
        div.innerHTML = `<div class="fixed w-64 z-10 text-f100 shadow-md bg-black/70 backdrop-blur-lg text-white rounded-md px-4 py-2" style="left:${x}px;top:${
          pos.y + 32
        }px;">${annotation[Btext]}</div>`;

        document.body.appendChild(div);
      }
    };

    mainBody.addEventListener("click", fn);

    return () => {
      mainBody.removeEventListener("click", fn);
    };
  }, [annotation]);

  return null;
};
