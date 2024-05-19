import DismissableCard2 from "@/components/dismissable-card2";
import ReviewCommentCard from "@/components/review-comment-card";

export default function Page() {
  return (
    <div className="grid gap-4 px-4 mt-4">
      {new Array(20).fill(0).map((_, i) => (
        <DismissableCard2 key={i} />
      ))}
    </div>
  );
}
