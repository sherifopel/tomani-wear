import HomeSection from '@/components/HomeSection'
import MembersCarousel from '@/components/MembersCarousel'
import { client } from '@/sanity/client'
import { HOME_SECTIONS_QUERY, SETTINGS_QUERY } from '@/sanity/queries'
import type { HomeSectionData } from '@/components/HomeSection'
import { connection } from 'next/server'
import { auth } from '@/auth'

type CarouselProduct = {
  _id: string
  name: string
  slug: string
  price: number
  compareAtPrice?: number | null
  inStock?: boolean
  image?: string | null
}

type Settings = {
  membersCarouselEnabled?: boolean
  membersCarouselTitle?: string
  membersCarouselProducts?: CarouselProduct[]
}

type HomePageData = {
  sections?: HomeSectionData[]
}

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ draft?: string }>
}) {
  await connection()

  const session = await auth()

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

  const [homePageData, settings]: [HomePageData | null, Settings | null] = await Promise.all([
    sanityClient.fetch(HOME_SECTIONS_QUERY),
    sanityClient.fetch(SETTINGS_QUERY),
  ])

  const sections = homePageData?.sections ?? []

  const showMembersCarousel =
    session?.user &&
    settings?.membersCarouselEnabled !== false &&
    (settings?.membersCarouselProducts?.length ?? 0) > 0

  return (
    <main className="flex-1">
      {sections.map((section, index) => (
        <HomeSection
          key={section._key}
          section={section}
          priority={index === 0}
        />
      ))}
      {showMembersCarousel && (
        <MembersCarousel
          title={settings?.membersCarouselTitle ?? 'Early Access — Members Only'}
          products={settings!.membersCarouselProducts!}
        />
      )}
    </main>
  )
}
