"use client";

import { type Author, type Poem } from "@prisma/client";
import { BookAIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { createPortal } from "react-dom";
import domToImage from "dom-to-image";
import { useEffect, useState } from "react";

interface Props {
  data: Poem & { author: Author };
}

const ImageDom = (props: Props) => {
  const { data: poem } = props;

  const content =
    poem.content
      .replaceAll("\n", "")
      .match(/[^。|！|？|，|；]+[。|！|？|，|；]+/g)
      ?.slice(0, 2) || [];

  return (
    <div
      id="image-dom"
      style={{
        height: 1440,
        width: 1080,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#3d345a",
        color: "#fff",
      }}
    >
      {content.map((c, i) => {
        return (
          <div
            key={i}
            style={{
              fontSize: 112,
              display: "flex",
              marginTop: i === 0 ? "-10%" : 0,
            }}
          >
            {c}
          </div>
        );
      })}

      <div
        style={{
          marginTop: 132,
          fontSize: 36,
          color: "#d4ceea",
          display: "flex",
        }}
      >
        —— {poem.author.dynasty}·{poem.author.name}《{poem.title}》
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "10%",
          fontSize: 32,
          color: "#bbb",
        }}
      >
        现代化中国诗词学习网站
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "7%",
          fontSize: 32,
          color: "#bbb",
        }}
      >
        aspoem.com
      </div>
    </div>
  );
};

const SaveShareButton = (props: Props) => {
  const { data: poem } = props;
  const [visable, setVisable] = useState(false);

  useEffect(() => {
    if (visable) {
      const box = document.getElementById("image-dom")!;

      void domToImage.toPng(box).then((blob) => {
        const link = document.createElement("a");
        link.href = blob;
        link.download = poem.id + ".png";
        link.click();

        setVisable(false);
      });
    }
  }, [poem.id, visable]);

  return (
    <>
      <div className="fixed -z-10 opacity-0">
        {visable && createPortal(<ImageDom data={poem} />, document.body)}
      </div>
      <Button
        variant={"outline"}
        onClick={() => {
          setVisable(true);
        }}
      >
        <BookAIcon className="mr-2 h-6 w-6 text-destructive" />
        分享到小红书
      </Button>
    </>
  );
};

export default SaveShareButton;
