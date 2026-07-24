import HomeSection from '@/components/HomeSection'
import { client } from '@/sanity/client'
import { HOME_SECTIONS_QUERY } from '@/sanity/queries'
import type { HomeSectionData } from '@/components/HomeSection'
import { connection } from 'next/server'

type HomePageData = {
  sections?: HomeSectionData[]
}

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ draft?: string }>
}) {
  await connection()

  const params = await searchParams
  const canReadDrafts =
    process.env.NODE_ENV === 'development' &&
    params?.draft === '1' &&
    Boolean(process.env.SANITY_API_READ_TOKEN)
  const sanityClient = canReadDrafts
    ? client.withConfig({
        token: process.env.SANITY_API_READ_TOKEN,
        perspective: 'drafts',
        useCdn: false,
      })
    : client

  const homePageData: HomePageData | null = await sanityClient.fetch(HOME_SECTIONS_QUERY)
  const sections = homePageData?.sections ?? []

  return (
    <main className="flex-1">
      {sections.map((section, index) => (
        <HomeSection
          key={section._key}
          section={section}
          priority={index === 0}
        />
      ))}
    </main>
  )
}
