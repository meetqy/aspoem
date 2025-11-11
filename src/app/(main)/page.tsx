"use client";

import { api } from "@/trpc/react";

// import { redirect } from "next/navigation";
export default function HomePage() {
  const { data } = api.poem.getRandom.useQuery();
  // redirect("/poems");
  return null;
}
