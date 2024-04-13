"use client";

import { api } from "~/trpc/react";

export default function Page() {
  const { data: poem } = api.poem.findById.useQuery({
    id: 292,
    lang: "en",
  });

  console.log(poem);

  return <div></div>;
}
