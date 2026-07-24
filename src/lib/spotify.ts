// Module-level token cache — survives across requests in the same server process.
// The Client Credentials token is valid for 1 hour; we refresh 60s before expiry.
let cachedToken: string | null = null
let tokenExpiresAt = 0

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken

  const clientId     = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
  if (!clientId || !clientSecret) throw new Error('Spotify credentials not configured')

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!res.ok) throw new Error(`Spotify token request failed: ${res.status}`)

  const data = await res.json() as { access_token: string; expires_in: number }
  cachedToken    = data.access_token
  tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000
  return cachedToken
}

// Accepts a full Spotify track URL or a bare track ID.
// Returns the 30-second preview MP3 URL, or null if the track has no preview.
export async function getSpotifyPreviewUrl(trackUrlOrId: string): Promise<string | null> {
  const match   = trackUrlOrId.match(/track\/([A-Za-z0-9]+)/)
  const trackId = match ? match[1] : trackUrlOrId.trim()

  const token = await getAccessToken()
  const res   = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) return null
  const data = await res.json() as { preview_url: string | null }
  return data.preview_url
}
