"use client";

import { type Poem, type Author } from "@prisma/client";
import { Check, ClipboardCopy } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { MyHost, cn } from "~/utils";

interface Props {
  data: Poem & { author: Author };
  className?: string;
}

const CopyButton = (props: Props) => {
  const { data: poem } = props;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"secondary"}
          size={"icon"}
          className={cn(props.className)}
          onClick={() => {
            const originText = `${poem.content} \n—— 《${poem.title}》${poem.author.dynasty}·${poem.author.name}`;

            const text = `<p>${poem.content.replaceAll(
              "\n",
              "<br/>",
            )}</p> <p>—— 《<a href="${MyHost}/poem/${poem.id}"><b>${
              poem.title
            }</b></a>》${poem.author.dynasty} · <a href="${MyHost}/author/${
              poem.author.id
            }"><b>${poem.author.name}</b></a></p><p><b>【译文】</b></p><p>${
              poem.translation
            }</p>`;

            const blobHtml = new Blob([text], { type: "text/html" });
            const blobText = new Blob([originText], { type: "text/plain" });
            const data = [
              new ClipboardItem({
                ["text/html"]: blobHtml,
                ["text/plain"]: blobText,
              }),
            ];

            void navigator.clipboard.write(data);
          }}
        >
          <ClipboardCopy className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex items-center space-x-2">
          <Check className="h-4 w-4 text-primary" />
          <span>已复制</span>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CopyButton;
