import { redirect } from "next/navigation";

export default function Page({
  params,
}: {
  params: { id: number; page: number };
}) {
  return redirect(`/tag/${params.id}`);
}
