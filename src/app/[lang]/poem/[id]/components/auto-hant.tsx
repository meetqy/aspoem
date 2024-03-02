"use client";

import { type Poem } from "@prisma/client";
import { convertToHant } from "~/app/create/poem/convert";
import { api } from "~/trpc/react";

export default function AutoHant({ poem }: { poem: Poem }) {
  const json = {
    id: poem.id,
    content: convertToHant(poem.content),
    title: convertToHant(poem.title),
    introduce: poem.introduce ? convertToHant(poem.introduce) : undefined,
    annotation: poem.annotation ? convertToHant(poem.annotation) : undefined,
    translation: poem.translation ? convertToHant(poem.translation) : undefined,
  };

  console.log(json);

  api.poem.updateHant.useQuery(json);

  return null;
}
