import Link from "next/link";

interface Props {
  text: string;
  href: string;
}

export default function CardItem(props: Props) {
  const first = props.text[props.text.length - 1];

  return (
    <Link
      href={props.href}
      className="relative flex aspect-square cursor-pointer items-end overflow-hidden rounded-box shadow transition-transform hover:border hover:shadow-xl"
    >
      <span
        className="text-stroke absolute left-0 top-0  flex h-full w-full items-center justify-center"
        style={{ fontSize: 210 }}
      >
        {first}
      </span>
      <p className="w-full truncate bg-neutral/90 px-2 py-3 text-neutral-content">
        {props.text}
      </p>
    </Link>
  );
}
