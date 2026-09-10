// CallMeBot free WhatsApp notification API — https://www.callmebot.com/blog/free-api-whatsapp-messages/
//
// Setup (one-time per number):
//   1. Save +34 644 59 78 93 as "CallMeBot" in WhatsApp
//   2. Send the message: I allow callmebot to send me messages
//   3. They reply with your API key
//
// Env var (comma-separated, one entry per recipient):
//   CALLMEBOT_NUMBERS = "447700900000:abc123,2348012345678:xyz789"
//   Format: internationalPhone:apiKey  (no + prefix, no spaces)

function getRecipients() {
  const env = process.env.CALLMEBOT_NUMBERS
  if (!env) return []
  return env
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => {
      const [phone, apiKey] = s.split(':')
      return { phone: phone?.trim(), apiKey: apiKey?.trim() }
    })
    .filter(r => r.phone && r.apiKey) as { phone: string; apiKey: string }[]
}

async function sendToNumber(phone: string, apiKey: string, text: string) {
  const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(text)}&apikey=${apiKey}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`CallMeBot ${res.status} for ${phone}`)
}

// ── Generic base — use this to add new alert types ────────────────────────────

export async function sendWhatsApp(message: string) {
  const recipients = getRecipients()
  if (recipients.length === 0) return
  await Promise.allSettled(
    recipients.map(({ phone, apiKey }) => sendToNumber(phone, apiKey, message))
  )
}

// ── Named alert functions — one per event type ────────────────────────────────

export async function notifyNewReview({
  productSlug,
  reviewerName,
  rating,
  comment,
}: {
  productSlug: string
  reviewerName: string
  rating: number
  comment: string | null
}) {
  const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating)
  const lines = [
    `🛍 New Tomanni review`,
    `Product: ${productSlug}`,
    `From: ${reviewerName}`,
    `Rating: ${stars} (${rating}/5)`,
    comment ? `"${comment}"` : null,
    `Status: Pending approval`,
  ].filter(Boolean).join('\n')

  await sendWhatsApp(lines)
}

export async function notifyNewOrder({
  orderRef,
  customerName,
  totalNgn,
  itemCount,
}: {
  orderRef: string
  customerName: string | null
  totalNgn: number
  itemCount: number
}) {
  const lines = [
    `🎉 New Tomanni order!`,
    `Ref: ${orderRef}`,
    `Customer: ${customerName ?? 'Guest'}`,
    `Items: ${itemCount}`,
    `Total: ₦${totalNgn.toLocaleString('en-NG')}`,
    `tomanni.com/admin/orders`,
  ].join('\n')

  await sendWhatsApp(lines)
}

export async function notifyPaymentFailed({
  orderRef,
  customerName,
  totalNgn,
}: {
  orderRef: string
  customerName: string | null
  totalNgn: number
}) {
  const lines = [
    `⚠️ Payment failed`,
    `Ref: ${orderRef}`,
    `Customer: ${customerName ?? 'Guest'}`,
    `Amount: ₦${totalNgn.toLocaleString('en-NG')}`,
    `tomanni.com/admin/orders`,
  ].join('\n')

  await sendWhatsApp(lines)
}

export async function notifyNewCustomer({
  customerName,
  email,
}: {
  customerName: string | null
  email: string
}) {
  const lines = [
    `👤 New Tomanni customer`,
    `Name: ${customerName ?? 'Unknown'}`,
    `Email: ${email}`,
  ].join('\n')

  await sendWhatsApp(lines)
}
