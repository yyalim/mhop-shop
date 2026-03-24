import Image from 'next/image'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { addToBasket } from '@/app/actions/basket'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const product = await prisma.product.findUnique({ where: { id } })

  if (!product) notFound()

  const addAction = addToBasket.bind(null, product.id, 1)

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-col gap-10 md:flex-row">
        {/* Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100 md:w-1/2">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>

        {/* Details */}
        <div className="flex flex-1 flex-col gap-4">
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>

          <p className="text-3xl font-semibold text-indigo-600">
            €{Number(product.price).toFixed(2)}
          </p>

          <p className="text-sm text-gray-500">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>

          <p className="text-gray-700">{product.description}</p>

          {product.stock === 0 ? (
            <span className="inline-block rounded-lg bg-gray-100 px-4 py-3 text-center text-sm text-gray-400">
              Out of stock
            </span>
          ) : (
            <form action={addAction} className="mt-auto">
              <button
                type="submit"
                className="w-full rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700 md:w-auto"
              >
                Add to basket
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}
