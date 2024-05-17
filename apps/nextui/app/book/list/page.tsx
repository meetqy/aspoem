import DiscountCard from "@/components/discount-card";

export default function Page() {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {Array.from({ length: 20 }).map((_, i) => (
        <DiscountCard key={i} />
      ))}
    </div>
  );
}
