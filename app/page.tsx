import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { addToBasket } from '@/app/actions/basket'

export default async function Home() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'asc' } })

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">All Products</h1>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => {
          const addAction = addToBasket.bind(null, product.id, 1)
          return (
            <div
              key={product.id}
              className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            >
              <Link href={`/products/${product.id}`} className="relative block aspect-[3/2] overflow-hidden bg-gray-100">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform hover:scale-105"
                />
              </Link>

              <div className="flex flex-1 flex-col gap-2 p-4">
                <Link href={`/products/${product.id}`} className="line-clamp-2 text-sm font-medium text-gray-900 hover:underline">
                  {product.name}
                </Link>

                <p className="mt-auto text-base font-semibold text-indigo-600">
                  €{Number(product.price).toFixed(2)}
                </p>

                {product.stock === 0 ? (
                  <span className="block rounded-lg bg-gray-100 px-3 py-2 text-center text-sm text-gray-400">
                    Out of stock
                  </span>
                ) : (
                  <form action={addAction}>
                    <button
                      type="submit"
                      className="w-full rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                      Add to basket
                    </button>
                  </form>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}
