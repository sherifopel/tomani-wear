'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { User, LogOut, Package, Settings } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'

export default function AccountButton() {
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, right: 0 })
  const [mounted, setMounted] = useState(false)
  const isLoggedIn = status === 'authenticated'
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => { setMounted(true) }, [])

  const close = () => setIsOpen(false)

  function updatePos() {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right })
    }
  }

  function handleMouseEnter() {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    updatePos()
    setIsOpen(true)
  }

  function handleMouseLeave() {
    closeTimer.current = setTimeout(() => setIsOpen(false), 200)
  }

  const dropdownContent = (
    <>
      {isLoggedIn ? (
        <>
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
            {session?.user?.image ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={session.user.image}
                alt={session.user.name ?? ''}
                className="w-8 h-8 rounded-full shrink-0 object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <User size={14} strokeWidth={1.5} className="text-gray-400" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-medium truncate">{session?.user?.name ?? 'My Account'}</p>
              <p className="text-[11px] text-gray-400 truncate">{session?.user?.email}</p>
            </div>
          </div>
          <Link href="/account" onClick={close} data-testid="account-link-my-account"
            className="flex items-center gap-2.5 px-4 py-3 text-xs hover:bg-gray-50 transition-colors">
            <Settings size={13} strokeWidth={1.5} /> My Account
          </Link>
          <Link href="/account/orders" onClick={close} data-testid="account-link-orders"
            className="flex items-center gap-2.5 px-4 py-3 text-xs hover:bg-gray-50 transition-colors border-t border-gray-100">
            <Package size={13} strokeWidth={1.5} /> My Orders
          </Link>
          <button onClick={() => signOut({ callbackUrl: '/' })} data-testid="account-sign-out"
            className="flex items-center gap-2.5 px-4 py-3 text-xs text-red-500 hover:bg-gray-50 transition-colors border-t border-gray-100 w-full rounded-b-md">
            <LogOut size={13} strokeWidth={1.5} /> Sign Out
          </button>
        </>
      ) : (
        <>
          <Link href="/sign-in" onClick={close} data-testid="account-link-sign-in"
            className="flex items-center gap-2.5 px-4 py-3 text-xs hover:bg-gray-50 transition-colors rounded-t-md">
            <User size={13} strokeWidth={1.5} /> Sign In
          </Link>
          <Link href="/sign-in" onClick={close} data-testid="account-link-create-account"
            className="flex items-center gap-2.5 px-4 py-3 text-xs hover:bg-gray-50 transition-colors border-t border-gray-100 rounded-b-md">
            <User size={13} strokeWidth={1.5} /> Create Account
          </Link>
        </>
      )}
    </>
  )

  return (
    <div className="relative">
      {/* Icon button — hover triggers open, mouse leave starts close timer */}
      <button
        ref={buttonRef}
        data-testid="nav-account-button"
        aria-label="Account"
        aria-expanded={isOpen}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => { updatePos(); setIsOpen(prev => !prev) }}
        className="p-1.5 rounded hover:bg-gray-100 transition-colors duration-200"
      >
        <User
          className={`h-[18px] w-[18px] md:h-5 md:w-5 transition-colors duration-200 ${
            isLoggedIn ? 'text-green-400' : 'text-black'
          }`}
          strokeWidth={1.5}
          fill={isLoggedIn ? 'rgba(74,222,128,0.15)' : 'none'}
        />
      </button>

      {/* ── Desktop dropdown via portal (escapes overflow:hidden header) ── */}
      {mounted && createPortal(
        <div
          data-testid="account-dropdown"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ top: pos.top, right: pos.right }}
          className={`hidden md:flex flex-col fixed z-[500] w-52
            bg-white border border-gray-200 rounded-md shadow-lg
            transition-all duration-150 origin-top-right
            ${isOpen
              ? 'opacity-100 scale-100 pointer-events-auto'
              : 'opacity-0 scale-95 pointer-events-none'
            }`}
        >
          {/* Arrow caret pointing up to the icon */}
          <div className="absolute -top-[7px] right-3 w-3 h-3 bg-white border-l border-t border-gray-200 rotate-45" />
          {dropdownContent}
        </div>,
        document.body
      )}

      {/* ── Mobile backdrop ─────────────────────────────────────────── */}
      <div
        onClick={close}
        className={`md:hidden fixed inset-0 z-[200] bg-black transition-opacity duration-300 ${
          isOpen ? 'opacity-40 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* ── Mobile bottom sheet ─────────────────────────────────────── */}
      <div
        data-testid="account-sheet"
        className={`md:hidden flex flex-col fixed bottom-0 left-0 right-0 z-[201]
          bg-white rounded-t-xl shadow-2xl
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>
        <div className="px-5 py-3 border-b border-gray-100 shrink-0">
          <p className="text-xs uppercase tracking-widest font-medium">Account</p>
        </div>

        {isLoggedIn ? (
          <>
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
              {session?.user?.image ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={session.user.image}
                  alt={session.user.name ?? ''}
                  className="w-10 h-10 rounded-full shrink-0 object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <User size={16} strokeWidth={1.5} className="text-gray-400" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{session?.user?.name ?? 'Welcome back'}</p>
                <p className="text-xs text-gray-400 truncate">{session?.user?.email}</p>
              </div>
            </div>
            <Link href="/account" onClick={close} data-testid="account-sheet-my-account"
              className="flex items-center gap-3 px-5 py-4 text-sm border-b border-gray-100 hover:bg-gray-50 active:bg-gray-100">
              <Settings size={16} strokeWidth={1.5} /> My Account
            </Link>
            <Link href="/account/orders" onClick={close} data-testid="account-sheet-orders"
              className="flex items-center gap-3 px-5 py-4 text-sm border-b border-gray-100 hover:bg-gray-50 active:bg-gray-100">
              <Package size={16} strokeWidth={1.5} /> My Orders
            </Link>
            <button onClick={() => { signOut({ callbackUrl: '/' }); close() }} data-testid="account-sheet-sign-out"
              className="flex items-center gap-3 px-5 py-4 text-sm text-red-500 w-full hover:bg-gray-50 active:bg-gray-100">
              <LogOut size={16} strokeWidth={1.5} /> Sign Out
            </button>
          </>
        ) : (
          <>
            <Link href="/sign-in" onClick={close} data-testid="account-sheet-sign-in"
              className="flex items-center gap-3 px-5 py-5 text-sm border-b border-gray-100 hover:bg-gray-50 active:bg-gray-100">
              <User size={16} strokeWidth={1.5} /> Sign In
            </Link>
            <Link href="/sign-in" onClick={close} data-testid="account-sheet-create-account"
              className="flex items-center gap-3 px-5 py-5 text-sm hover:bg-gray-50 active:bg-gray-100">
              <User size={16} strokeWidth={1.5} /> Create Account
            </Link>
          </>
        )}
        <div className="h-6 shrink-0" />
      </div>
    </div>
  )
}
