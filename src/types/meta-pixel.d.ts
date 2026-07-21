// Type declarations for the Meta Pixel global fbq function injected by the pixel script.
// Without this TypeScript would complain that window.fbq doesn't exist.
interface Window {
  fbq: (
    action: string,
    event: string,
    params?: Record<string, unknown>
  ) => void
  _fbq?: unknown
}
