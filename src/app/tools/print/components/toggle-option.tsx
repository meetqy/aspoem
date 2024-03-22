"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Checkbox } from "~/components/ui/checkbox";

export type Options = {
  translation: boolean;
  py: boolean;
  border: boolean;
};

export const ToggleOption = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [opts, setOpts] = useState<Options>({
    translation: searchParams.get("translation") === "true",
    py: searchParams.get("py") === "true",
    border: searchParams.get("border") === "true",
  });

  const toggle = (key: keyof Options) => {
    setOpts({
      ...opts,
      [key]: !opts[key],
    });
  };

  useEffect(() => {
    router.push(
      `?id=${id}&translation=${opts.translation}&py=${opts.py}&border=${opts.border}`,
    );
  }, [opts, router, id]);

  return (
    <div className="space-y-2 text-f50">
      <p className="mb-2 text-muted-foreground">自定义打印内容</p>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="border"
          checked={opts.border}
          onCheckedChange={() => toggle("border")}
        />
        <label htmlFor="border">边框</label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="py"
          checked={opts.py}
          onCheckedChange={() => toggle("py")}
        />
        <label htmlFor="py">拼音</label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="translation"
          checked={opts.translation}
          onCheckedChange={() => toggle("translation")}
        />
        <label htmlFor="translation">译文</label>
      </div>
    </div>
  );
};
