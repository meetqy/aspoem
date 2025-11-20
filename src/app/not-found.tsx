import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center space-y-6 text-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          未找到页面
        </h1>
        <p className="text-muted-foreground sm:text-lg">
          抱歉，您访问的页面可能已经被移除或者暂时不可用。
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow transition hover:bg-primary/90"
        >
          返回首页
        </Link>
        <Link
          href="/poems"
          className="rounded-md border border-input px-6 py-2 text-sm font-medium transition hover:bg-muted"
        >
          浏览诗词
        </Link>
      </div>
    </main>
  );
}
