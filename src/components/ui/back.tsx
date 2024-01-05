"use client";

import { ChevronLeft } from "lucide-react";
import { Button } from "./button";
import { useRouter } from "next/navigation";

export default function Back() {
  const router = useRouter();

  return (
    <Button variant="outline" size={"xs"} onClick={() => router.back()}>
      <ChevronLeft className="mr-2 h-4 w-4" strokeWidth={1} /> 返回
    </Button>
  );
}
