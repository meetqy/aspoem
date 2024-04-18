import SearchDialog from "../[lang]/components/search";
import { getDictionary } from "~/dictionaries";

export default async function Page() {
  const dict = await getDictionary();

  return (
    <div>
      <SearchDialog dict={dict} lang="zh-Hans" />
    </div>
  );
}
