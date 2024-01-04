"use client";

import { useRouter } from "next/navigation";

export default function SectionClick({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  const router = useRouter();

  return (
    <section
      onClick={() => {
        router.push(href);
      }}
    >
      {children}
    </section>
  );
}
