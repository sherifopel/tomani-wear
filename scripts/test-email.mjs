import { Resend } from 'resend'
import { readFileSync } from 'fs'

// Parse .env.local manually
const envLines = readFileSync('.env.local', 'utf8').split('\n')
const env = {}
for (const line of envLines) {
  const match = line.match(/^([^#=]+)=(.*)$/)
  if (match) env[match[1].trim()] = match[2].trim()
}

const key      = env.RESEND_API_KEY || env.AUTH_RESEND_KEY || ''
const emailsRaw = env.REVIEW_NOTIFY_EMAILS || ''
const emails   = emailsRaw.split(',').map(e => e.trim()).filter(Boolean)

console.log('Key set:', key.length > 5 ? `yes (${key.length} chars)` : 'NO — empty or missing')
console.log('Sending to:', emails)

if (!key || key.length < 5) {
  console.error('No valid Resend key found. Check RESEND_API_KEY or AUTH_RESEND_KEY in .env.local')
  process.exit(1)
}

const resend = new Resend(key)
const result = await resend.emails.send({
  from:    'Tomanni <onboarding@resend.dev>',
  to:      emails,
  subject: 'Test — Tomanni Review Notification',
  html:    '<p>This is a test review notification. If you see this, it works!</p>',
})

console.log('Resend full response:', JSON.stringify(result, null, 2))
