"use client";

import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { type getDictionary, type Locale } from "~/dictionaries";
import { MyHost } from "~/utils";

export default function GoFeedback({
  id,
  lang,
  dict,
}: {
  id: number;
  lang: Locale;
  dict: Awaited<ReturnType<typeof getDictionary>>;
}) {
  const router = useRouter();

  return (
    <Button
      variant={"link"}
      className="text-destructive"
      onClick={() => {
        router.push(`/${lang}/feedback`);
        localStorage.setItem(
          "twikoo-draft",
          `${dict.poem.report_default_placeholder} ${MyHost}/${lang}/poem/${id}\n`,
        );
      }}
    >
      {dict.poem.go_feedback} <ChevronRight strokeWidth={1} />
    </Button>
  );
}
