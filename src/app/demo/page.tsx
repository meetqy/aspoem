export default function Page() {
  const text = "字体渲染是个复杂的过程 Font rendering is a complex process";
  return (
    <div className="space-y-8">
      <div>
        <p className="text-[64px] font-bold">{text} 64px</p>
        <p className="text-[64px] font-medium">{text} 64px</p>
        <p className="text-[64px] font-light">{text} 64px</p>
      </div>

      <div className="mt-4">
        <p className="text-[48px] font-bold">{text} 48px</p>
        <p className="text-[48px] font-medium">{text} 48px</p>
        <p className="text-[48px] font-light">{text} 48px</p>
      </div>

      <div className="mt-4">
        <p className="text-[32px] font-bold">{text} 32px</p>
        <p className="text-[32px] font-medium">{text} 32px</p>
        <p className="text-[32px] font-light">{text} 32px</p>
      </div>

      <div className="mt-4">
        <p className="text-[28px] font-bold">{text} 28px</p>
        <p className="text-[28px] font-medium">{text} 28px</p>
        <p className="text-[28px] font-light">{text} 28px</p>
      </div>

      <div className="mt-4">
        <p className="text-[24px] font-bold">{text} 24px</p>
        <p className="text-[24px] font-medium">{text} 24px</p>
        <p className="text-[24px] font-light">{text} 24px</p>
      </div>

      <div className="mt-4">
        <p className="text-[20px] font-bold">{text} 20px</p>
        <p className="text-[20px] font-medium">{text} 20px</p>
        <p className="text-[20px] font-light">{text} 20px</p>
      </div>

      <div className="mt-4">
        <p className="font-bold">{text} 16px</p>
        <p className="font-medium">{text} 16px</p>
        <p className="font-light">{text} 16px</p>
      </div>
    </div>
  );
}
