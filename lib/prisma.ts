import { PrismaClient } from '@prisma/client'
import { PrismaNeonHttp } from '@prisma/adapter-neon'

const isNeon = process.env.DATABASE_URL?.includes('neon.tech')

function createClient(): PrismaClient {
  if (isNeon) {
    // Use Neon's HTTP transport — no WebSocket / ws package needed,
    // works reliably in Vercel serverless and edge runtimes.
    const adapter = new PrismaNeonHttp(process.env.DATABASE_URL!, {})
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new PrismaClient({ adapter } as any)
  }
  // Local Docker — standard TCP connection, no adapter needed.
  return new PrismaClient()
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma = globalForPrisma.prisma ?? createClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
