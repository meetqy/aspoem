"use client";

import { api } from "~/trpc/react";

export default function Page() {
  const { data } = api.poem.findById.useQuery({ id: 2508 });
  console.log(data);

  return <div></div>;
}
