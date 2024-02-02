"use client";

import { api } from "~/trpc/react";

export default function a() {
  const { data } = api.poem.findByTagId.useQuery({ id: 11 });
  console.log(data);

  return null;
}
