import { type Sort } from "~/types";
import ListPage from "../_components/ListPage";

export default async function Page({
  params,
  searchParams,
}: {
  params: { page: string };
  searchParams?: { sort: Sort };
}) {
  return <ListPage params={params} searchParams={searchParams} />;
}
