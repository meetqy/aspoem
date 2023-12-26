import Link from "next/link";
import styles from "./index.module.css";

interface Props {
  text: string;
  href: string;
}

export default function CardItem(props: Props) {
  const first = props.text[0];

  return (
    <Link
      href={props.href}
      className="relative flex aspect-square cursor-pointer items-end overflow-hidden rounded-box shadow transition-transform hover:border hover:shadow-xl"
    >
      <span className={`text-stroke ${styles.title}`}>{first}</span>

      <p className="w-full truncate bg-neutral/90 px-2 py-3 text-neutral-content">
        {props.text}
      </p>
    </Link>
  );
}
