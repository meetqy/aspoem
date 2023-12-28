import ListPage from "~/app/_components/ListPage";

export default async function Page({ params }: { params: { page: string } }) {
  return <ListPage params={params} />;
}
