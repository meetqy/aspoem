import { redirect } from "next/navigation";
import { type Locale } from "~/dictionaries";

export default function Page({ params }: { params: { lang: Locale } }) {
  return redirect(`/${params.lang}/author/list/1`);
}
