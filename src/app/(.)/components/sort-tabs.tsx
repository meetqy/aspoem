import Link from "next/link";
import { TabsTrigger, TabsList, Tabs } from "~/components/ui/tabs";
import { type Sort } from "~/types";

export default function SortTabs({ sort }: { sort?: Sort }) {
  return (
    <Tabs defaultValue={sort ?? ""}>
      <TabsList>
        <TabsTrigger value="" asChild>
          <Link href={`?`} replace>
            默认
          </Link>
        </TabsTrigger>
        <TabsTrigger value="updatedAt" asChild>
          <Link href={`?sort=updatedAt`} replace>
            更新时间
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
