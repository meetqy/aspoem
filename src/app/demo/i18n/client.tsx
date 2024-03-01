"use client";

import { api } from "~/trpc/react";

export default function Client() {
  const { data } = api.poem.findById.useQuery(568);

  return <div>client: {data}</div>;
}
