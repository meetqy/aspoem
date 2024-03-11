"use client";

import { Button } from "~/components/ui/button";

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
    <div className="space-x-2">
      <Button
        variant={props.value.translation ? "default" : "secondary"}
        size={"sm"}
        onClick={() => toggle("translation")}
      >
        译文
      </Button>
      {/* <Button
        variant={props.value.py ? "default" : "secondary"}
        size={"sm"}
        onClick={() => toggle("py")}
      >
        拼音
      </Button> */}
      <Button
        variant={props.value.border ? "default" : "secondary"}
        size={"sm"}
        onClick={() => toggle("border")}
      >
        边框
      </Button>
    </div>
  );
};
