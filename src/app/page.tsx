import Link from "next/link";
import { api } from "~/trpc/server";

export default async function Home() {
  const prompts = await api.prompt.find.query({});
  return (
    <div>
      {prompts.map((item) => (
        <ul key={item.id}>
          <li>{item.name}</li>
          <li>
            {item.content.split("\\n").map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </li>
          <li>
            <Link href={item.contributedLink ?? "#"} target="_blank">
              {item.contributedName}
            </Link>
          </li>
          <li>
            <Link href={item.referenceLink ?? "javascript:;"} target="_blank">
              {item.referenceName}
            </Link>
          </li>
          <li>
            {item.tags.map((tag) => (
              <span key={tag.id}>{tag.name}</span>
            ))}
          </li>
        </ul>
      ))}
    </div>
  );
}
