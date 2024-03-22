import { ToggleOption } from "../toggle-option";
import { SelectPoem } from "./select-poem";

export const Aside = () => {
  return (
    <aside className="flex h-full w-72 flex-col space-y-8 bg-muted/50 p-4">
      <SelectPoem />
      <ToggleOption />
    </aside>
  );
};
