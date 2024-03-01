"use client";

import { api } from "~/trpc/react";

export default function Client() {
  const { data } = api.poem.findById.useQuery({
    id: 568,
    lang: "zh-Hant",
  });

  console.log(data);

  return <div>client: {}</div>;
}
