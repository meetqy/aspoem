"use client";

import { api } from "~/trpc/react";

export default function a() {
  const { data } = api.poem.find.useQuery();
  console.log(data);

  return null;
}
