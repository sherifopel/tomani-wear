import { Resend } from 'resend'

const resendKey = process.env.RESEND_API_KEY ?? process.env.AUTH_RESEND_KEY
const resend = resendKey ? new Resend(resendKey) : null

type OrderItem = {
  name: string
  size: string | null
  quantity: number
  priceNgn: number
}

function emailShell(body: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;padding:40px 0">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #ebebeb">
        <tr>
          <td style="padding:36px 48px 28px;border-bottom:1px solid #f0f0f0;text-align:center">
            <p style="margin:0;font-size:18px;font-weight:700;letter-spacing:0.15em;color:#000">TOMANNI</p>
          </td>
        </tr>
        <tr><td style="padding:40px 48px">${body}</td></tr>
        <tr>
          <td style="padding:20px 48px;border-top:1px solid #f0f0f0;text-align:center">
            <p style="margin:0;font-size:11px;color:#bbb">© ${new Date().getFullYear()} Tomanni. Lagos, Nigeria.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function itemRows(items: OrderItem[]) {
  return items.map(item => `
    <tr>
      <td style="padding:12px 20px;border-bottom:1px solid #f4f4f4">
        <span style="font-size:13px;color:#000">${item.name}</span>
        ${item.size ? `<span style="font-size:12px;color:#999"> — Size ${item.size}</span>` : ''}
      </td>
      <td style="padding:12px 20px;border-bottom:1px solid #f4f4f4;text-align:right;white-space:nowrap">
        <span style="font-size:12px;color:#999">×${item.quantity}</span>
        <span style="font-size:13px;color:#000;margin-left:8px">₦${(item.priceNgn * item.quantity).toLocaleString('en-NG')}</span>
      </td>
    </tr>`).join('')
}

function priceSummary({ items, totalNgn, discountAmount, isGuest }: {
  items: OrderItem[]
  totalNgn: number
  discountAmount: number | null
  isGuest: boolean
}) {
  const subtotal   = items.reduce((s, i) => s + i.priceNgn * i.quantity, 0)
  const discount   = discountAmount ?? 0
  const delivery   = totalNgn - subtotal + discount

  const deliveryLabel = isGuest
    ? `₦${delivery.toLocaleString('en-NG')}`
    : 'Free'

  return `
    ${discount > 0 ? `
    <tr>
      <td style="padding:8px 20px;border-bottom:1px solid #f4f4f4">
        <span style="font-size:12px;color:#999">Subtotal</span>
      </td>
      <td style="padding:8px 20px;border-bottom:1px solid #f4f4f4;text-align:right">
        <span style="font-size:13px;color:#000">₦${subtotal.toLocaleString('en-NG')}</span>
      </td>
    </tr>
    <tr>
      <td style="padding:8px 20px;border-bottom:1px solid #f4f4f4">
        <span style="font-size:12px;color:#999">Discount</span>
      </td>
      <td style="padding:8px 20px;border-bottom:1px solid #f4f4f4;text-align:right">
        <span style="font-size:13px;color:#16a34a">−₦${discount.toLocaleString('en-NG')}</span>
      </td>
    </tr>` : ''}
    <tr>
      <td style="padding:8px 20px;border-bottom:1px solid #f4f4f4">
        <span style="font-size:12px;color:#999">Delivery</span>
        ${isGuest ? '<span style="font-size:10px;color:#bbb;margin-left:4px">(guest)</span>' : '<span style="font-size:10px;color:#16a34a;margin-left:4px">(member)</span>'}
      </td>
      <td style="padding:8px 20px;border-bottom:1px solid #f4f4f4;text-align:right">
        <span style="font-size:13px;color:${isGuest ? '#000' : '#16a34a'}">${deliveryLabel}</span>
      </td>
    </tr>
    <tr>
      <td style="padding:14px 20px">
        <span style="font-size:13px;font-weight:700;color:#000">Total paid</span>
      </td>
      <td style="padding:14px 20px;text-align:right">
        <span style="font-size:15px;font-weight:700;color:#000">₦${totalNgn.toLocaleString('en-NG')}</span>
      </td>
    </tr>`
}

export async function sendOrderAcknowledgement({
  to,
  customerName,
  paystackRef,
  totalNgn,
  discountAmount,
  isGuest,
  items,
}: {
  to: string
  customerName: string | null
  paystackRef: string
  totalNgn: number
  discountAmount: number | null
  isGuest: boolean
  items: OrderItem[]
}) {
  if (!resend) throw new Error('No Resend API key configured (RESEND_API_KEY or AUTH_RESEND_KEY)')

  const firstName = customerName?.split(' ')[0] ?? 'there'

  const body = `
    <p style="margin:0 0 16px;font-size:15px;color:#000">Hi ${firstName},</p>
    <p style="margin:0 0 28px;font-size:14px;color:#444;line-height:1.6">
      Thank you for your order — we've received it and it's being prepared for you.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #ebebeb;margin-bottom:8px">
      <tr>
        <td colspan="2" style="padding:12px 20px;background:#f8f8f8;border-bottom:1px solid #f0f0f0">
          <span style="font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.08em">Order reference</span>
          <span style="font-size:14px;font-weight:700;color:#000;letter-spacing:0.05em;margin-left:10px">${paystackRef}</span>
        </td>
      </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #ebebeb;margin-bottom:8px">
      <tr>
        <td colspan="2" style="padding:12px 20px;border-bottom:1px solid #f0f0f0;background:#f8f8f8">
          <span style="font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.08em">Items ordered</span>
        </td>
      </tr>
      ${itemRows(items)}
      ${priceSummary({ items, totalNgn, discountAmount, isGuest })}
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #ebebeb;margin-bottom:28px">
      <tr>
        <td style="padding:14px 20px">
          <span style="font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.08em">Status</span>
          <span style="font-size:13px;color:#d97706;font-weight:500;margin-left:12px">Processing</span>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 8px;font-size:14px;color:#444;line-height:1.6">We'll send you another update when your order is on its way.</p>
    <p style="margin:0 0 32px;font-size:14px;color:#444;line-height:1.6">If you have any questions, reply to this email or contact us directly.</p>
    <p style="margin:0;font-size:14px;color:#000;font-weight:500">The Tomanni Team</p>`

  return resend.emails.send({
    from:    'Tomanni <onboarding@resend.dev>',
    to,
    subject: `Your Tomanni order is confirmed — ${paystackRef}`,
    html:    emailShell(body),
  })
}

const STATUS_MESSAGES: Record<string, { headline: string; body: string; color: string }> = {
  dispatched: {
    headline: 'Your order is on its way!',
    body:     'Great news — your order has been dispatched and is heading to you.',
    color:    '#2563eb',
  },
  delivered: {
    headline: 'Your order has been delivered',
    body:     'Your order has been marked as delivered. We hope you love it!',
    color:    '#16a34a',
  },
  cancelled: {
    headline: 'Your order has been cancelled',
    body:     'Your order has been cancelled. If you believe this is a mistake, please contact us directly.',
    color:    '#dc2626',
  },
  returned: {
    headline: 'Your return has been processed',
    body:     'We've received and processed your return. Please allow a few days for any refund to appear.',
    color:    '#7c3aed',
  },
  processing: {
    headline: 'Your order is being prepared',
    body:     'Your order is now being processed and prepared for dispatch.',
    color:    '#d97706',
  },
}

export async function sendStatusUpdate({
  to,
  customerName,
  paystackRef,
  status,
  trackingNumber,
}: {
  to: string
  customerName: string | null
  paystackRef: string
  status: string
  trackingNumber: string | null
}) {
  if (!resend) throw new Error('No Resend API key configured (RESEND_API_KEY or AUTH_RESEND_KEY)')

  const firstName = customerName?.split(' ')[0] ?? 'there'
  const msg = STATUS_MESSAGES[status] ?? STATUS_MESSAGES.processing

  const trackingRow = trackingNumber ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #ebebeb;margin-bottom:28px">
      <tr>
        <td style="padding:14px 20px">
          <span style="font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.08em">Tracking number</span>
          <span style="font-size:14px;font-weight:600;color:#000;letter-spacing:0.05em;margin-left:12px">${trackingNumber}</span>
        </td>
      </tr>
    </table>` : ''

  const body = `
    <p style="margin:0 0 16px;font-size:15px;color:#000">Hi ${firstName},</p>
    <p style="margin:0 0 28px;font-size:14px;color:#444;line-height:1.6">${msg.body}</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #ebebeb;margin-bottom:8px">
      <tr>
        <td style="padding:14px 20px;background:#f8f8f8;border-bottom:1px solid #f0f0f0">
          <span style="font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.08em">Order reference</span>
          <span style="font-size:14px;font-weight:700;color:#000;letter-spacing:0.05em;margin-left:10px">${paystackRef}</span>
        </td>
      </tr>
      <tr>
        <td style="padding:14px 20px">
          <span style="font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.08em">Status</span>
          <span style="font-size:14px;font-weight:600;margin-left:12px;color:${msg.color}">${msg.headline}</span>
        </td>
      </tr>
    </table>

    ${trackingRow}

    <p style="margin:0 0 32px;font-size:14px;color:#444;line-height:1.6">If you have any questions, reply to this email or contact us directly.</p>
    <p style="margin:0;font-size:14px;color:#000;font-weight:500">The Tomanni Team</p>`

  return resend.emails.send({
    from:    'Tomanni <onboarding@resend.dev>',
    to,
    subject: `${msg.headline} — ${paystackRef}`,
    html:    emailShell(body),
  })
}
