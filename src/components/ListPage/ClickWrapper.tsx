"use client";

import { useRouter } from "next/navigation";

export default function ClickWrapper({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: (router: ReturnType<typeof useRouter>) => void;
}) {
  const router = useRouter();

  return <div onClick={() => onClick(router)}>{children}</div>;
}
