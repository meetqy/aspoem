import ListPage from "~/app/_components/ListPage";
import { type Sort } from "~/types";

export default async function Page({
  params,
  searchParams,
}: {
  params: { page: string };
  searchParams?: { sort: Sort };
}) {
  return <ListPage params={params} searchParams={searchParams} />;
}
