import { getPoemSlugs } from '@/lib/data/poems'

export default async function Home() {
  const slugs = await getPoemSlugs()
  console.log(slugs)
  return <div>123</div>
}
