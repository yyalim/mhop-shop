import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { logout } from '@/app/actions/auth'
import { prisma } from '@/lib/prisma'

export default async function Header() {
  const session = await getSession()

  const basketCount = session
    ? await prisma.basketItem.count({ where: { userId: session.userId } })
    : 0

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold text-indigo-600">
          Shop
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          {/* Basket icon */}
          <Link href="/basket" className="relative flex items-center gap-1 text-gray-700 hover:text-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.4 7h12.8M7 13H5.4M10 21a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
            {basketCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                {basketCount}
              </span>
            )}
          </Link>

          {session ? (
            <>
              <span className="text-gray-700">Hi, {session.name}</span>
              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-gray-700 hover:bg-gray-50"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-gray-700 hover:bg-gray-50"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-white hover:bg-indigo-700"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
