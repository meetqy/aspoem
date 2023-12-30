"use client";

import { ChevronLeftIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button className="btn btn-sm" onClick={() => router.back()}>
      <ChevronLeftIcon className="h-5 w-5" /> 返回
    </button>
  );
}
