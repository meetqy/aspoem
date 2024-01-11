import { redirect } from "next/navigation";

export default function Page() {
  redirect("/create/poem");

  return null;
}
