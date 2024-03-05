import { redirect } from "next/navigation";

export default function Page({ params }: { params: { lang: string } }) {
  return redirect(`/${params.lang}/tag`);
}
