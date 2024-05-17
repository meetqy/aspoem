import ReviewCommentCard from "@/components/review-comment-card";

export default function Page() {
  return new Array(20).fill(0).map((_, i) => <ReviewCommentCard key={i} />);
}
