import Link from "next/link";
import { TabsTrigger, TabsList, Tabs } from "~/components/ui/tabs";
import { type Sort } from "~/types";

export default function SortTabs({ sort }: { sort?: Sort }) {
  return (
    <Tabs defaultValue={sort ?? ""}>
      <TabsList className="h-8">
        <TabsTrigger value="" asChild>
          <Link href={`?`} replace>
            推荐
          </Link>
        </TabsTrigger>
        <TabsTrigger value="improve" asChild>
          <Link href={`?sort=improve`} replace>
            完善度
          </Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
