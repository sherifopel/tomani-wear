import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { signOut } from '@/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Package, MapPin, User, LogOut, ChevronRight } from 'lucide-react'

function getInitials(name?: string | null) {
  if (!name) return '?'
  const parts = name.trim().split(' ').filter(Boolean)
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function formatMemberSince(date: Date) {
  return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}

export default async function AccountPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/sign-in?callbackUrl=/account')

  const user = session.user

  const [dbUser, orderCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: user.id },
      select: { createdAt: true },
    }),
    prisma.order.count({ where: { userId: user.id } }),
  ])

  const firstName = user.name?.split(' ')[0] ?? 'there'
  const memberSince = dbUser?.createdAt ? formatMemberSince(dbUser.createdAt) : null

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 md:py-14">

      {/* ── Profile header ─────────────────────────────────────────────── */}
      <div
        data-testid="account-profile-header"
        className="flex items-center gap-5 mb-10 pb-8 border-b border-gray-100"
      >
        {/* Avatar */}
        {user.image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={user.image}
            alt={user.name ?? ''}
            data-testid="account-avatar"
            className="w-16 h-16 rounded-full object-cover shrink-0"
          />
        ) : (
          <div
            data-testid="account-avatar-initials"
            className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center shrink-0"
          >
            <span className="text-lg font-semibold text-gray-500 tracking-wide">
              {getInitials(user.name)}
            </span>
          </div>
        )}

        {/* Name / email / member since */}
        <div className="min-w-0">
          <h1
            data-testid="account-heading"
            className="text-lg font-semibold tracking-tight truncate"
          >
            {user.name ?? 'My Account'}
          </h1>
          <p className="text-sm text-gray-400 truncate">{user.email}</p>
          {memberSince && (
            <p className="text-[11px] text-gray-300 mt-1 uppercase tracking-widest">
              Member since {memberSince}
            </p>
          )}
        </div>
      </div>

      {/* ── Nav cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-12">

        <Link
          href="/account/orders"
          data-testid="account-card-orders"
          className="group flex items-center justify-between border border-gray-200 rounded-md px-5 py-5 hover:border-black transition-colors duration-200"
        >
          <div className="flex items-center gap-4">
            <Package size={20} strokeWidth={1.5} className="text-gray-400 group-hover:text-black transition-colors shrink-0" />
            <div>
              <p className="font-medium text-sm">My Orders</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {orderCount === 0 ? 'No orders yet' : `${orderCount} order${orderCount === 1 ? '' : 's'}`}
              </p>
            </div>
          </div>
          <ChevronRight size={16} strokeWidth={1.5} className="text-gray-300 group-hover:text-black transition-colors shrink-0" />
        </Link>

        <Link
          href="/account/addresses"
          data-testid="account-card-addresses"
          className="group flex items-center justify-between border border-gray-200 rounded-md px-5 py-5 hover:border-black transition-colors duration-200"
        >
          <div className="flex items-center gap-4">
            <MapPin size={20} strokeWidth={1.5} className="text-gray-400 group-hover:text-black transition-colors shrink-0" />
            <div>
              <p className="font-medium text-sm">Addresses</p>
              <p className="text-xs text-gray-400 mt-0.5">Saved delivery addresses</p>
            </div>
          </div>
          <ChevronRight size={16} strokeWidth={1.5} className="text-gray-300 group-hover:text-black transition-colors shrink-0" />
        </Link>

        <Link
          href="/account/profile"
          data-testid="account-card-profile"
          className="group flex items-center justify-between border border-gray-200 rounded-md px-5 py-5 hover:border-black transition-colors duration-200"
        >
          <div className="flex items-center gap-4">
            <User size={20} strokeWidth={1.5} className="text-gray-400 group-hover:text-black transition-colors shrink-0" />
            <div>
              <p className="font-medium text-sm">Profile</p>
              <p className="text-xs text-gray-400 mt-0.5">Update your details</p>
            </div>
          </div>
          <ChevronRight size={16} strokeWidth={1.5} className="text-gray-300 group-hover:text-black transition-colors shrink-0" />
        </Link>

      </div>

      {/* ── Sign out ───────────────────────────────────────────────────── */}
      <form
        action={async () => {
          'use server'
          await signOut({ redirectTo: '/' })
        }}
      >
        <button
          data-testid="account-sign-out-button"
          type="submit"
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-red-500 transition-colors duration-200"
        >
          <LogOut size={13} strokeWidth={1.5} />
          Sign out
        </button>
      </form>

    </div>
  )
}
