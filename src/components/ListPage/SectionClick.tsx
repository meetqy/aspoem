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
      id="section-click"
      onClick={(e) => {
        if ((e.target as HTMLElement).tagName === "A") return;
        router.push(href);
      }}
    >
      {children}
    </section>
  );
}
