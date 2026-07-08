import { redirect } from 'next/navigation'

// The layout handles auth. This page just sends logged-in users straight to their orders.
export default function AccountPage() {
  redirect('/account/profile')
}
