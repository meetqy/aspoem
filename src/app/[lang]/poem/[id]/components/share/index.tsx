"use client";

import { Button } from "~/components/ui/button";
import { createPortal } from "react-dom";
import * as htmlToImage from "html-to-image";
import { useEffect, useState } from "react";
import { random } from "lodash-es";
import { bgCards, r2Host, urlToBase64 } from "~/utils";

interface Props {
  children: React.ReactNode;
  title: React.ReactNode;
  scale?: number;
}

const SaveShareButton = (props: Props) => {
  const { scale = 1 } = props;
  const [visable, setVisable] = useState(false);

  useEffect(() => {
    (async () => {
      if (visable) {
        const image = bgCards[random(0, bgCards.length - 1)]!;
        const url = `${r2Host}/neutral-card-bg/${image.name}.jpg`;
        const base64 = await urlToBase64(url);

        const box = document.getElementById("draw-share-card")!;

        void htmlToImage
          .toPng(box, {
            width: box.clientWidth * scale,
            height: box.clientHeight * scale,
            style: {
              color: image.color,
              opacity: "1",
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              backgroundImage: `url(${base64})`,
            },
          })
          .then((src) => {
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
