import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const products = [
  {
    name: 'Wireless Noise-Cancelling Headphones',
    description:
      'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and studio-quality sound.',
    price: '149.99',
    imageUrl: 'https://picsum.photos/seed/headphones/600/400',
    stock: 25,
  },
  {
    name: 'Mechanical Keyboard',
    description:
      'Compact tenkeyless mechanical keyboard with Cherry MX switches, RGB backlighting, and aluminium frame.',
    price: '89.99',
    imageUrl: 'https://picsum.photos/seed/keyboard/600/400',
    stock: 40,
  },
  {
    name: 'Cotton Crew-Neck T-Shirt',
    description:
      'Classic unisex 100% organic cotton tee. Pre-shrunk, breathable, and available in a range of colours.',
    price: '19.99',
    imageUrl: 'https://picsum.photos/seed/tshirt/600/400',
    stock: 120,
  },
  {
    name: 'Hardcover Notebook',
    description:
      'A5 dot-grid hardcover notebook with 200 pages of 100 gsm ivory paper. Lay-flat binding.',
    price: '14.99',
    imageUrl: 'https://picsum.photos/seed/notebook/600/400',
    stock: 80,
  },
  {
    name: 'Stainless Steel Water Bottle',
    description:
      '500 ml double-wall vacuum-insulated bottle. Keeps drinks cold 24 h or hot 12 h. BPA-free.',
    price: '24.99',
    imageUrl: 'https://picsum.photos/seed/bottle/600/400',
    stock: 60,
  },
  {
    name: 'USB-C Hub (7-in-1)',
    description:
      '7-in-1 multiport adapter: 4K HDMI, 100 W PD, 3× USB-A 3.0, SD and microSD card readers.',
    price: '44.99',
    imageUrl: 'https://picsum.photos/seed/hub/600/400',
    stock: 35,
  },
  {
    name: 'Desk Plant — Pothos',
    description:
      'Low-maintenance golden pothos in a 12 cm ceramic pot. Air-purifying and pet-friendly.',
    price: '12.99',
    imageUrl: 'https://picsum.photos/seed/plant/600/400',
    stock: 30,
  },
  {
    name: 'Scented Soy Candle',
    description:
      '200 g hand-poured soy candle with wooden wick. Fragrance: cedarwood & vanilla. 40-hour burn.',
    price: '18.99',
    imageUrl: 'https://picsum.photos/seed/candle/600/400',
    stock: 50,
  },
  {
    name: 'Wool Beanie',
    description:
      'Ribbed merino wool beanie, one-size-fits-most. Naturally temperature-regulating and odour-resistant.',
    price: '29.99',
    imageUrl: 'https://picsum.photos/seed/beanie/600/400',
    stock: 45,
  },
  {
    name: 'Programming TypeScript — Book',
    description:
      'A practical guide to TypeScript covering types, generics, async patterns, and real-world project structures.',
    price: '34.99',
    imageUrl: 'https://picsum.photos/seed/tsbook/600/400',
    stock: 20,
  },
]

async function main() {
  console.log('Seeding products...')
  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: {},
      create: product,
    })
  }
  console.log(`Seeded ${products.length} products.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
