import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

export async function sendOrderAcknowledgement({
  to,
  customerName,
  orderNumber,
  totalNgn,
  paystackRef,
}: {
  to: string
  customerName: string | null
  orderNumber: string
  totalNgn: number
  paystackRef: string | null
}) {
  if (!resend) throw new Error('RESEND_API_KEY is not configured')

  const firstName = customerName?.split(' ')[0] ?? 'there'
  const amount    = `₦${totalNgn.toLocaleString('en-NG')}`

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;padding:40px 0">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #ebebeb">

        <!-- Header -->
        <tr>
          <td style="padding:36px 48px 28px;border-bottom:1px solid #f0f0f0;text-align:center">
            <p style="margin:0;font-size:18px;font-weight:700;letter-spacing:0.15em;color:#000">TOMANNI</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 48px">
            <p style="margin:0 0 16px;font-size:15px;color:#000">Hi ${firstName},</p>
            <p style="margin:0 0 24px;font-size:14px;color:#444;line-height:1.6">
              Thank you for your order — we've received it and it's being prepared for you.
            </p>

            <!-- Order details box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #ebebeb;margin-bottom:28px">
              <tr>
                <td style="padding:16px 20px;border-bottom:1px solid #f4f4f4">
                  <span style="font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.08em">Order number</span><br>
                  <span style="font-size:15px;font-weight:700;color:#000;letter-spacing:0.05em">${orderNumber}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:16px 20px;border-bottom:1px solid #f4f4f4">
                  <span style="font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.08em">Total paid</span><br>
                  <span style="font-size:15px;font-weight:600;color:#000">${amount}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:16px 20px">
                  <span style="font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.08em">Status</span><br>
                  <span style="font-size:14px;color:#d97706;font-weight:500">Processing</span>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 8px;font-size:14px;color:#444;line-height:1.6">
              We'll send you another update when your order is on its way.
            </p>
            <p style="margin:0 0 32px;font-size:14px;color:#444;line-height:1.6">
              If you have any questions, reply to this email or contact us directly.
            </p>

            <p style="margin:0;font-size:14px;color:#000;font-weight:500">The Tomanni Team</p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 48px;border-top:1px solid #f0f0f0;text-align:center">
            ${paystackRef ? `<p style="margin:0 0 8px;font-size:11px;color:#bbb">Payment ref: ${paystackRef}</p>` : ''}
            <p style="margin:0;font-size:11px;color:#bbb">© ${new Date().getFullYear()} Tomanni. Lagos, Nigeria.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

  return resend.emails.send({
    from:    'Tomanni <onboarding@resend.dev>',
    to,
    subject: `Your Tomanni order is confirmed — ${orderNumber}`,
    html,
  })
}
