import Link from "next/link";
import { type Sort } from "~/types";
import { type Dictionary } from "~/dictionaries";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";

export default function SortTabs({
  sort,
  dict,
}: {
  sort?: Sort;
  dict: Dictionary;
}) {
  return (
    <ToggleGroup size={"sm"} type="single" value={sort ?? " "}>
      <ToggleGroupItem
        className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        value=" "
        asChild
        aria-label={dict.poem_list.tab_new}
      >
        <Link href={`?`} replace>
          {dict.poem_list.tab_new}
        </Link>
      </ToggleGroupItem>
      <ToggleGroupItem
        value="improve"
        className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        aria-label={dict.poem_list.tab_improve}
        asChild
      >
        <Link href={`?sort=improve`} replace>
          {dict.poem_list.tab_improve}
        </Link>
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
