import Link from "next/link";
import { TabsTrigger, TabsList, Tabs } from "~/components/ui/tabs";
import { type Sort } from "~/types";

export default function SortTabs({ sort }: { sort?: Sort }) {
  return (
    <Tabs defaultValue={sort ?? ""}>
      <TabsList>
        <TabsTrigger value="" asChild>
          <Link href={`?`}>默认</Link>
        </TabsTrigger>
        <TabsTrigger value="updatedAt" asChild>
          <Link href={`?sort=updatedAt`}>更新时间</Link>
        </TabsTrigger>
        <TabsTrigger value="improve" asChild>
          <Link href={`?sort=improve`}>完善度</Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
