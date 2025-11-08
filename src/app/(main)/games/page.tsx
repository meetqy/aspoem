import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function Page() {
  return (
    <div className="flex items-center container mx-auto aspect-video">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">🚧</EmptyMedia>
          <EmptyTitle>开发中...</EmptyTitle>
          <EmptyDescription>
            可在 <Link href="https://github.com/meetqy/aspoem">Github</Link>
            中了解最新进度
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link href="/poems">返回首页</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
