"use client";

import { type Poem, type Author } from "@prisma/client";
import { ClipboardIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { type Locale } from "~/dictionaries";
import { MyHost, cn } from "~/utils";

interface Props {
  data: Poem & { author: Author };
  className?: string;
  lang: Locale;
}

const CopyButton = (props: Props) => {
  const { data: poem } = props;

  const [copy, setCopy] = useState(false);

  return (
    <Button
      variant={"outline"}
      className={cn(props.className)}
      onClick={() => {
        if (copy) {
          return;
        }
        setCopy(true);
        const originText = `${poem.content} \n—— 《${poem.title}》${poem.author.dynasty}·${poem.author.name}\n\n【译文】\n${poem.translation} \n\n #aspoem #诗词学习网站`;

        const text = `<p>${poem.content.replaceAll(
          "\n",
          "<br/>",
        )}</p> <p>—— 《<a href="${MyHost}/poem/${poem.id}"><b>${
          poem.title
        }</b></a>》${poem.author.dynasty} · <a href="${MyHost}/author/${
          poem.author.id
        }"><b>${
          poem.author.name
        }</b></a></p><p><b>译文</b></p><p>${poem.translation?.replaceAll(
          "\n",
          "<br/>",
        )}</p><p> #aspoem #诗词学习网站</p>`;

        const blobHtml = new Blob([text], { type: "text/html" });
        const blobText = new Blob([originText], { type: "text/plain" });
        const data = [
          new ClipboardItem({
            ["text/html"]: blobHtml,
            ["text/plain"]: blobText,
          }),
        ];

        void navigator.clipboard.write(data);

        setTimeout(() => {
          setCopy(false);
        }, 2000);
      }}
    >
      <ClipboardIcon className="mr-2 h-5 w-5 text-primary" />
      {copy ? "已复制" : "复制诗词译文"}
    </Button>
  );
};

export default CopyButton;
