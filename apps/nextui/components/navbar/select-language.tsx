"use client";

import { cn, Select, SelectItem } from "@nextui-org/react";

export const languages = [
  { name: "中文繁體", value: "zh-Hant" },
  { name: "中文简体", value: "zh-Hans" },
];

export const SelectLanguage = ({ className }: { className?: string }) => {
  return (
    <Select
      items={languages}
      defaultSelectedKeys={["zh-Hant"]}
      labelPlacement="outside"
      className={cn("w-32", className)}
      aria-label="Select language"
    >
      {(lang) => (
        <SelectItem key={lang.value} textValue={lang.name}>
          <div className="flex gap-2 items-center">
            <div className="flex flex-col">
              <span className="text-small">{lang.name}</span>
              <span className="text-tiny text-default-400">{lang.value}</span>
            </div>
          </div>
        </SelectItem>
      )}
    </Select>
  );
};
