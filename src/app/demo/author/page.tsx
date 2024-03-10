import "./index.css";

export default function Page() {
  return (
    <main className="m-auto min-h-screen max-w-screen-md">
      <header className="relative flex h-48 w-full border-b border-border">
        <div className="flex w-1/2 flex-col justify-center text-center">
          <p className="text-7xl">
            李白
            <span className="font-mono text-3xl italic text-muted-foreground">
              li bai
            </span>
          </p>
          <p className="mt-4 text-lg text-secondary-foreground">
            字太白，号青莲居士
          </p>
        </div>

        <div className="flex w-1/2 flex-col justify-center pl-8 text-lg text-secondary-foreground">
          <p>
            <span className="font-semibold">性别：</span>男
          </p>
          <p>
            <span className="font-semibold">享年：</span>61岁（701年 - 762年）
          </p>
          <p>
            <span className="font-semibold">朝代：</span>唐
          </p>
          <p>
            <span className="font-semibold">祖籍：</span>
            陇西成纪（今甘肃静宁西南）
          </p>
        </div>
      </header>
    </main>
  );
}
