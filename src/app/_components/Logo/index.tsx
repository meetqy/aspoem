import Link from "next/link";
import { description } from "~/utils/constant";
import styles from "./index.module.css";

export default function Logo() {
  return (
    <Link href={"/"} title={description} className={`${styles.logo}`}>
      As Poem
    </Link>
  );
}
