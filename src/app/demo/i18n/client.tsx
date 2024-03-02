"use client";

import { api } from "~/trpc/react";

export default function Client() {
  const { data } = api.poem.find.useQuery({
    lang: "zh-Hant",
    sort: "improve",
  });

  console.log(data);

  return <div>client: {}</div>;
}
