import Link from "next/link";
import { type Locale } from "~/dictionaries";

export const Logo = ({ lang }: { lang: Locale }) => {
  return (
    <Link
      href={`/${lang}`}
      className="text-primary-outline flex h-16 items-center justify-center font-serif text-[2.5rem] font-bold"
      style={{ fontFamily: "Palatino,Times New Roman" }}
    >
      AsPoem
      <span className="text-primary">.com</span>
    </Link>
  );
};
