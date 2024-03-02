"use client";

import { type Poem } from "@prisma/client";
import { convertToHant } from "~/app/create/poem/convert";
import { api } from "~/trpc/react";

export default function AutoHant({ poem }: { poem: Poem }) {
  const mut = api.poem.updateHant.useMutation();
  const hantContent = convertToHant(poem.content);

  if (hantContent === poem.content) return null;

  const json = {
    id: poem.id,
    content: hantContent,
    title: convertToHant(poem.title),
    introduce: poem.introduce ? convertToHant(poem.introduce) : undefined,
    annotation: poem.annotation ? convertToHant(poem.annotation) : undefined,
    translation: poem.translation ? convertToHant(poem.translation) : undefined,
  };

  mut.mutate(json);

  return null;
}
