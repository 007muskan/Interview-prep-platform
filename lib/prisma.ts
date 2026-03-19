import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

let _prisma: PrismaClient | undefined

function createPrismaClient() {
  // Prevent Prisma client creation during build time
  if (process.env.VERCEL && !process.env.VERCEL_ENV) {
    throw new Error('Prisma client not available during build')
  }
  
  if (!_prisma) {
    _prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
    
    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = _prisma
    }
  }
  return _prisma
}

export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    // Only create the client when actually accessed
    const client = globalForPrisma.prisma ?? createPrismaClient()
    return client[prop as keyof PrismaClient]
  }
})
