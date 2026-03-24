import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { encryptSession, decryptSession, type SessionData } from './session'
import { prisma } from './prisma'

const COOKIE_NAME = 'session'

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(COOKIE_NAME)
  if (!cookie?.value) return null
  return decryptSession(cookie.value)
}

export async function requireSession(): Promise<SessionData> {
  const session = await getSession()
  if (!session) redirect('/login')

  // Guard against stale session cookies (e.g. DB wiped while cookie persists)
  const userExists = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true },
  })
  if (!userExists) {
    await clearSessionCookie()
    redirect('/login')
  }

  return session
}

export async function setSessionCookie(session: SessionData): Promise<void> {
  const encrypted = await encryptSession(session)
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, encrypted, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}
