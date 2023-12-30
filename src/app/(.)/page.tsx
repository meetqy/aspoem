import ListPage from "../_components/ListPage";

export default async function Page({
  params,
  searchParams,
}: {
  params: { page: string };
  searchParams?: { sort: "updatedAt" };
}) {
  return <ListPage params={params} searchParams={searchParams} />;
}
