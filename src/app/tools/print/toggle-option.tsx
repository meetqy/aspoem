"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
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
  console.log(id);

  const [opts, setOpts] = useState<Options>({
    translation: false,
    py: false,
    border: false,
  });

  const toggle = (key: keyof Options) => {
    setOpts({
      ...opts,
      [key]: !opts[key],
    });

    router.push(`?id=${id}&${key}=${!opts[key]}`);
  };

  return (
    <div>
      <p className="mb-2 text-muted-foreground">自定义打印内容</p>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="translation"
          checked={opts.translation}
          onCheckedChange={() => toggle("translation")}
        />
        <label htmlFor="translation">译文</label>
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
          id="border"
          checked={opts.border}
          onCheckedChange={() => toggle("border")}
        />
        <label htmlFor="border">边框</label>
      </div>
    </div>
  );
};
