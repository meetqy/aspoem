import Link from "next/link";
import styles from "./index.module.css";

interface Props {
  text: string;
  href: string;
}

export default function CardItem(props: Props) {
  const first = props.text[0];

  return (
    <Link href={`${props.href}?lt=${props.text}`} className={styles.card}>
      <span className={`text-stroke-base-100 ${styles.title}`}>{first}</span>

      <p className="w-full truncate bg-neutral/90 px-2 py-3 text-neutral-content">
        {props.text}
      </p>
    </Link>
  );
}
