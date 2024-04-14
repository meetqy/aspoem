"use client";

import { Button } from "~/components/ui/button";
import { createPortal } from "react-dom";
import { toPng } from "html-to-image";
import { useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
  title: React.ReactNode;
  scale?: number;
}

const buildPng = async (box: HTMLElement, scale: number) => {
  let result = "";
  const safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  const options = {
    width: box.clientWidth * scale,
    height: box.clientHeight * scale,
    cacheBust: true,
    style: {
      transform: `scale(${scale})`,
      transformOrigin: "top left",
    },
  };

  if (!safari) {
    return await toPng(box, options);
  }

  const resultBytes: number[] = [];
  let reBuild = true;

  while (reBuild) {
    const res = await toPng(box, options);

    if (
      (resultBytes.length > 0 &&
        res.length !== resultBytes[resultBytes.length - 1]) ||
      (resultBytes.length > 2 &&
        resultBytes[resultBytes.length - 2] ===
          resultBytes[resultBytes.length - 1])
    ) {
      result = res;
      reBuild = false;
    }

    resultBytes.push(res.length);
  }

  return result;
};

const SaveShareButton = (props: Props) => {
  let { scale = 1 } = props;
  const [visable, setVisable] = useState(false);

  scale = scale / window.devicePixelRatio;
  scale = scale < 1 ? 1 : scale;

  useEffect(() => {
    (async () => {
      if (visable) {
        const box = document.getElementById("draw-share-card")!;
        box.style.opacity = "1";
        const bgEl: HTMLElement | HTMLImageElement = box.querySelector(
          "#draw-share-card-bg",
        )!;

        let url = "";

        if (bgEl instanceof HTMLImageElement) {
          url = bgEl.src;
        } else {
          url = bgEl.style.backgroundImage.replace(/url\("(.+)"\)/, "$1");
        }

        const src = await buildPng(box, scale);
        if (!src) return;

        const div = document.createElement("div");
        div.setAttribute(
          "style",
          `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.25); z-index: 9998; display: flex; justify-content: center; align-items: center; flex-direction: column;`,
        );

        div.onclick = () => {
          document.body.removeChild(div);
        };

        const img = new Image();
        img.src = src;
        img.style.height = "90%";
        img.style.width = "auto";
        // contain
        img.style.objectFit = "contain";

        div.appendChild(img);

        const span = document.createElement("span");
        span.innerText = url;
        div.appendChild(span);
        span.style.color = "white";
        document.body.appendChild(div);

        setVisable(false);
      }
    })();
  }, [scale, visable]);

  return (
    <>
      {visable && createPortal(props.children, document.body)}
      <Button
        variant={"outline"}
        onClick={() => {
          setVisable(true);
        }}
      >
        {props.title}
      </Button>
    </>
  );
};

export default SaveShareButton;
