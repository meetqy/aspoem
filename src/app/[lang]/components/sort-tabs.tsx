import Link from "next/link";
import { TabsTrigger, TabsList, Tabs } from "~/components/ui/tabs";
import { type Sort } from "~/types";
import { type Dictionary } from "~/dictionaries";

export default function SortTabs({
  sort,
  dict,
}: {
  sort?: Sort;
  dict: Dictionary;
}) {
  return (
    <Tabs defaultValue={sort ?? ""}>
      <TabsList className="h-8">
        <TabsTrigger value="" asChild>
          <Link href={`?`} replace>
            {dict.poem_list.tab_new}
          </Link>
        </TabsTrigger>
        <TabsTrigger value="improve" asChild>
          <Link href={`?sort=improve`} replace>
            {dict.poem_list.tab_improve}
          </Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
