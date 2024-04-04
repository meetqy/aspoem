"use client";

import { api } from "~/trpc/react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { TypographyArticle } from "~/components/typography-article";

export default function Page() {
  const { data } = api.poem.findById.useQuery({
    id: 2255,
  });

  const [py, setPy] = useState(false);
  const [an, setAn] = useState(true);

  if (!data) return null;

  const py_paragraphs = data.contentPinYin?.split("\n") ?? [];
  const paragraphs = data.content.split("\n");
  const annotation = (
    data.annotation ? JSON.parse(data.annotation) : {}
  ) as Record<string, string>;

  return (
    <div className="m-auto min-h-screen max-w-screen-md border py-12">
      <div className="mb-12 space-x-8">
        <Button onClick={() => setPy(!py)}>拼音</Button>
        <Button onClick={() => setAn(!an)}>标注</Button>
      </div>

      <div id="main-body" className="relative px-4">
        <TypographyArticle
          paragraphs={paragraphs}
          py_paragraphs={py ? py_paragraphs : []}
          annotation={an ? annotation : {}}
        />
      </div>
    </div>
  );
}
