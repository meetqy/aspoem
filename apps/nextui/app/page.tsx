import DismissableCard from "@/components/dismissable-card";

export default function Page() {
  return (
    <div className="gap-4 grid p-4 grid-cols-2">
      {new Array(20).fill(0).map((_, i) => (
        <DismissableCard key={i} />
      ))}
    </div>
  );
}
