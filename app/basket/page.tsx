import Link from 'next/link'
import Image from 'next/image'
import { requireSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { removeFromBasket, updateQuantity } from '@/app/actions/basket'

export default async function BasketPage() {
  const session = await requireSession()

  const items = await prisma.basketItem.findMany({
    where: { userId: session.userId },
    include: { product: true },
    orderBy: { createdAt: 'asc' },
  })

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-xl text-gray-500">Your basket is empty.</p>
        <Link href="/" className="mt-6 inline-block text-indigo-600 hover:underline">
          Browse products
        </Link>
      </main>
    )
  }

  const total = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  )

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Your Basket</h1>

      <ul className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
        {items.map((item) => {
          const removeAction = removeFromBasket.bind(null, item.id)
          const decAction = updateQuantity.bind(null, item.id, item.quantity - 1)
          const incAction = updateQuantity.bind(null, item.id, item.quantity + 1)
          const lineTotal = Number(item.product.price) * item.quantity

          return (
            <li key={item.id} className="flex items-center gap-4 p-4">
              {/* Thumbnail */}
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>

              {/* Name + price */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.product.id}`}
                  className="block truncate text-sm font-medium text-gray-900 hover:underline"
                >
                  {item.product.name}
                </Link>
                <p className="text-sm text-gray-500">
                  €{Number(item.product.price).toFixed(2)} each
                </p>
              </div>

              {/* Quantity stepper */}
              <div className="flex items-center gap-1">
                <form action={decAction}>
                  <button
                    type="submit"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                </form>
                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                <form action={incAction}>
                  <button
                    type="submit"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </form>
              </div>

              {/* Line total */}
              <p className="w-20 text-right text-sm font-semibold text-gray-900">
                €{lineTotal.toFixed(2)}
              </p>

              {/* Remove */}
              <form action={removeAction}>
                <button
                  type="submit"
                  className="text-xs text-red-500 hover:text-red-700"
                  aria-label="Remove item"
                >
                  Remove
                </button>
              </form>
            </li>
          )
        })}
      </ul>

      {/* Order total + checkout */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-lg font-semibold text-gray-900">
          Total: <span className="text-indigo-600">€{total.toFixed(2)}</span>
        </p>
        <Link
          href="/checkout"
          className="rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700"
        >
          Proceed to checkout
        </Link>
      </div>
    </main>
  )
}
