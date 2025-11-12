import { redirect } from "next/navigation";

// import { redirect } from "next/navigation";
export default function HomePage() {
  redirect("/poems");
  return null;
}
