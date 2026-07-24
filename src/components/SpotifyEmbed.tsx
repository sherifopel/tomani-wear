function getTrackId(urlOrId: string): string {
  const match = urlOrId.match(/track\/([A-Za-z0-9]+)/)
  return match ? match[1] : urlOrId.trim()
}

export default function SpotifyEmbed({ trackUrlOrId }: { trackUrlOrId: string }) {
  const trackId = getTrackId(trackUrlOrId)
  const src = `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`

  return (
    <div className="absolute bottom-5 right-5 z-10 w-[280px] rounded-xl overflow-hidden shadow-2xl">
      <iframe
        src={src}
        width="100%"
        height="80"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        style={{ border: 'none' }}
      />
    </div>
  )
}
