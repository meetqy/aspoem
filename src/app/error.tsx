"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center space-y-6 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          出错了
        </h1>
        <p className="text-muted-foreground sm:text-lg max-w-md">
          抱歉，页面加载时出现了问题。请稍后重试。
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground font-mono">
            错误代码: {error.digest}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button onClick={reset} size="lg">
          重试
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/">返回首页</Link>
        </Button>
      </div>
    </main>
  );
}
