"use client";

import { api } from "~/trpc/react";
import "./index.css";
import { cn } from "~/utils";
import { useState } from "react";
import { Button } from "~/components/ui/button";

const chinese_symbols = "，。？！；：“”‘’（）《》【】、".split("");

export default function Page() {
  const { data } = api.poem.findById.useQuery({
    id: 2255,
  });

  const [py, setPy] = useState(false);

  if (!data) return null;

  const py_paragraphs = data.contentPinYin?.split("\n") ?? [];
  const paragraphs = data.content.split("\n");

  return (
    <div className="m-auto min-h-screen max-w-screen-md border py-24">
      <Button onClick={() => setPy(!py)}>拼音</Button>
      <Paragraph
        paragraphs={paragraphs}
        py_paragraphs={py ? py_paragraphs : []}
      />
    </div>
  );
}

export const Paragraph = ({
  paragraphs,
  py_paragraphs,
}: {
  paragraphs: string[];
  py_paragraphs: string[];
}) => {
  return (
    <>
      {paragraphs.map((paragraph, i) => (
        <p
          className={cn("py-line", {
            "no-py": py_paragraphs.length === 0,
          })}
          key={i}
        >
          {paragraph.split("").map((char, j) => (
            <Ruby key={j} char={char} rt={py_paragraphs[i]?.split(" ")[j]} />
          ))}
        </p>
      ))}
    </>
  );
};

export const Ruby = ({ char, rt }: { char: string; rt?: string }) => {
  if (rt && !chinese_symbols.includes(char)) {
    return (
      <span className="py-result-item">
        <ruby>
          <span className="py-chinese-item">{char}</span>
          <rp>(</rp>
          <rt>{rt}</rt>
          <rp>)</rp>
        </ruby>
      </span>
    );
  }

  return <span className="py-non-chinese-item">{char}</span>;
};
