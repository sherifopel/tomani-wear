// Telegram Bot notification system — replaces the CallMeBot approach.
//
// Setup (one-time):
//   1. Message @BotFather on Telegram → /newbot → get your token
//   2. Each recipient starts a chat with the bot and sends any message
//   3. Visit https://api.telegram.org/bot{TOKEN}/getUpdates to find each chat ID
//
// Env vars:
//   TELEGRAM_BOT_TOKEN  = 123456789:ABCdef...
//   TELEGRAM_CHAT_IDS   = 123456789,987654321   (comma-separated, one per recipient)

async function sendToChat(token: string, chatId: string, text: string) {
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Telegram error ${res.status}: ${err}`)
  }
}

// ── Generic base ──────────────────────────────────────────────────────────────

export async function sendWhatsApp(message: string) {
  const token   = process.env.TELEGRAM_BOT_TOKEN
  const chatIds = process.env.TELEGRAM_CHAT_IDS

  if (!token || !chatIds) return  // not configured — silently skip

  const ids = chatIds.split(',').map(s => s.trim()).filter(Boolean)
  if (ids.length === 0) return

  await Promise.allSettled(ids.map(id => sendToChat(token, id, message)))
}

// ── Named alert functions ─────────────────────────────────────────────────────

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
    `🛍 <b>New Tomanni review</b>`,
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
    `🎉 <b>New Tomanni order!</b>`,
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
    `⚠️ <b>Payment failed</b>`,
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
    `👤 <b>New Tomanni customer</b>`,
    `Name: ${customerName ?? 'Unknown'}`,
    `Email: ${email}`,
  ].join('\n')

  await sendWhatsApp(lines)
}
