"use client";

import { type Poem } from "@prisma/client";
import { useEffect } from "react";
import { convertToHant } from "~/app/create/poem/convert";
import { api } from "~/trpc/react";

export default function AutoHant({
  poem,
}: {
  poem: Poem & { is_hant: boolean };
}) {
  const mut = api.poem.updateHant.useMutation();

  useEffect(() => {
    const hantContent = convertToHant(poem.content);

    const json = {
      id: poem.id,
      content: hantContent,
      title: convertToHant(poem.title),
      introduce: poem.introduce ? convertToHant(poem.introduce) : undefined,
      annotation: poem.annotation ? convertToHant(poem.annotation) : undefined,
      translation: poem.translation
        ? convertToHant(poem.translation)
        : undefined,
    };

    if (hantContent !== poem.content && !poem.is_hant) {
      mut.mutate(json);
    }
  }, []);

  return null;
}
