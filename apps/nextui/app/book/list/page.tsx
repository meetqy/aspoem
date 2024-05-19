import DiscountCard from "@/components/discount-card";

export default function Page() {
  return (
    <div className="grid lg:grid-cols-2 lg:mt-8 mt-4 gap-4 lg:gap-6 px-4 max-w-screen-md mx-auto w-full">
      {Array.from({ length: 20 }).map((_, i) => (
        <DiscountCard key={i} />
      ))}
    </div>
  );
}
