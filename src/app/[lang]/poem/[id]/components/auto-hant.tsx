"use client";

import { type Poem } from "@prisma/client";
import { useEffect } from "react";
import { convertToHant } from "~/utils/convert";
import { api } from "~/trpc/react";

export default function AutoHant({
  poem,
}: {
  poem: Poem & { is_hant: boolean };
}) {
  const mut = api.poem.updateHant.useMutation();

  useEffect(() => {
    if (poem.is_hant) return;

    const json = {
      id: poem.id,
      content: convertToHant(poem.content),
      title: convertToHant(poem.title),
      introduce: poem.introduce ? convertToHant(poem.introduce) : undefined,
      annotation: poem.annotation ? convertToHant(poem.annotation) : undefined,
      translation: poem.translation
        ? convertToHant(poem.translation)
        : undefined,
    };

    mut.mutate(json);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
