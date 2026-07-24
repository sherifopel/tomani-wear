import HomeSection from '@/components/HomeSection'
import { client } from '@/sanity/client'
import { HOME_SECTIONS_QUERY } from '@/sanity/queries'
import type { HomeSectionData } from '@/components/HomeSection'
import { getSpotifyPreviewUrl } from '@/lib/spotify'
import { connection } from 'next/server'

// Raw shape from Sanity — includes spotifyTrackUrl before we resolve it
type RawSectionData = HomeSectionData & { spotifyTrackUrl?: string }

type HomePageData = {
  sections?: RawSectionData[]
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
  const rawSections = homePageData?.sections ?? []

  // For any section with a Spotify link but no uploaded audio file,
  // fetch the 30-second preview URL server-side and inject it as audioUrl.
  const sections: HomeSectionData[] = await Promise.all(
    rawSections.map(async ({ spotifyTrackUrl, ...section }) => {
      if (!section.audioUrl && spotifyTrackUrl) {
        const previewUrl = await getSpotifyPreviewUrl(spotifyTrackUrl).catch(() => null)
        return { ...section, audioUrl: previewUrl ?? undefined }
      }
      return section
    })
  )

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
