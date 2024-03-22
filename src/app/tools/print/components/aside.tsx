import { ToggleOption } from "./toggle-option";
import { SelectPoem } from "./select-poem";

export const Aside = () => {
  return (
    <>
      <aside className="fixed left-0 top-0 flex h-full w-72 flex-col space-y-8 bg-muted/50 p-4">
        <SelectPoem />
        <ToggleOption />
      </aside>
      <aside className="w-72"></aside>
    </>
  );
};
