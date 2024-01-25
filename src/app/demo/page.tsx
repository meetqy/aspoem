export default function Page() {
  const text = "字体渲染是个复杂的过程 Font rendering is a complex process";
  return (
    <div>
      <p className="text-[64px] font-bold">{text} 64px</p>
      <p className="text-[64px] font-light">{text} 64px</p>

      <p className="text-[48px] font-bold">{text} 48px</p>
      <p className="text-[48px] font-light">{text} 48px</p>

      <p className="text-[32px] font-bold">{text} 32px</p>
      <p className="text-[32px] font-light">{text} 32px</p>

      <p className="text-[28px] font-bold">{text} 28px</p>
      <p className="text-[28px] font-light">{text} 28px</p>

      <p className="text-[24px] font-bold">{text} 24px</p>
      <p className="text-[24px] font-light">{text} 24px</p>
    </div>
  );
}
