'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getSession, requireSession, clearSessionCookie } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function addToBasket(productId: string, quantity = 1) {
  // No session at all → preserve ?next= so user returns after login
  const session = await getSession()
  if (!session) redirect(`/login?next=/products/${productId}`)

  // Session cookie exists but user was deleted/DB was wiped → clear + redirect
  const userExists = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true },
  })
  if (!userExists) {
    await clearSessionCookie()
    redirect('/login')
  }

  await prisma.basketItem.upsert({
    where: { userId_productId: { userId: session.userId, productId } },
    update: { quantity: { increment: quantity } },
    create: { userId: session.userId, productId, quantity },
  })

  revalidatePath('/', 'layout')
}

export async function removeFromBasket(basketItemId: string) {
  const session = await requireSession()

  await prisma.basketItem.deleteMany({
    where: { id: basketItemId, userId: session.userId },
  })

  revalidatePath('/basket')
}

export async function updateQuantity(basketItemId: string, quantity: number) {
  const session = await requireSession()

  if (quantity <= 0) {
    await prisma.basketItem.deleteMany({
      where: { id: basketItemId, userId: session.userId },
    })
  } else {
    await prisma.basketItem.updateMany({
      where: { id: basketItemId, userId: session.userId },
      data: { quantity },
    })
  }

  revalidatePath('/basket')
}
