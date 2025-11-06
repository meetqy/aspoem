import { Edit3Icon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Feedback() {
  return (
    <div className="bg-gradient-to-r from-accent/50 to-transparent p-6 rounded-lg border space-y-2">
      <Button asChild>
        <Link
          href="https://github.com/meetqy/aspoem/blob/next/poems/bai-ju-yi/zhi-zhong-shu-sheng.md?plain=1#L19-L20"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Edit3Icon className="size-4" />
          纠错与完善/内容贡献
        </Link>
      </Button>

      <p className="text-sm">
        首次贡献？点击
        <Link href="#" className="font-medium ml-1 hover:underline">
          查看教程～
        </Link>
      </p>
    </div>
  );
}
