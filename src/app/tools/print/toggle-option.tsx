"use client";

import { Checkbox } from "~/components/ui/checkbox";

export type Options = {
  translation: boolean;
  py: boolean;
  border: boolean;
};

export const ToggleOption = (props: {
  onChange?: (opt: Options) => void;
  value: Options;
}) => {
  const toggle = (key: keyof Options) => {
    props.onChange?.({ ...props.value, [key]: !props.value[key] });
  };

  return (
    <div>
      <p className="mb-2 text-muted-foreground">自定义打印内容</p>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="translation"
          checked={props.value.translation}
          onCheckedChange={() => toggle("translation")}
        />
        <label htmlFor="translation">译文</label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="py"
          checked={props.value.py}
          onCheckedChange={() => toggle("py")}
        />
        <label htmlFor="py">拼音</label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="border"
          checked={props.value.border}
          onCheckedChange={() => toggle("border")}
        />
        <label htmlFor="border">边框</label>
      </div>
    </div>
  );
};
