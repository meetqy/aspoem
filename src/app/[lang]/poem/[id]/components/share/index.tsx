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

const SaveShareButton = (props: Props) => {
  let { scale = 1 } = props;
  const [visable, setVisable] = useState(false);

  scale = scale / window.devicePixelRatio;

  useEffect(() => {
    (async () => {
      if (visable) {
        const box = document.getElementById("draw-share-card")!;
        box.style.opacity = "1";

        toPng(box, {
          width: box.clientWidth * scale,
          height: box.clientHeight * scale,
          cacheBust: true,
          style: {
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          },
        }).then((src) => {
          if (!src) return;

          const div = document.createElement("div");
          div.style.position = "fixed";
          div.style.top = "0";
          div.style.left = "0";
          div.style.width = "100%";
          div.style.height = "100%";
          div.style.backgroundColor = "rgba(0, 0, 0, 0.25)";
          div.style.zIndex = "9998";
          div.style.display = "flex";
          div.style.justifyContent = "center";
          div.style.alignItems = "center";

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

          document.body.appendChild(div);

          setVisable(false);
        });
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
