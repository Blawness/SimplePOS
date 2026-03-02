import { PrismaClient } from '@prisma/client'
import path from 'path'

function normalizeDatabaseUrl () {
  const raw = (process.env.DATABASE_URL || '').trim().replace(/^["']|["']$/g, '')
  if (!raw) return

  const match = raw.match(/^file:(?:\.\/)?(.*)$/)
  if (!match) return

  const relativePath = match[1] || 'prisma/dev.db'
  const absolutePath = path.resolve(process.cwd(), relativePath)
  let normalizedPath = absolutePath.replace(/\\/g, '/')

  // Git Bash/MINGW can resolve to /c/Users/...; convert to C:/Users/...
  if (process.platform === 'win32' && normalizedPath.startsWith('/') && /^\/[a-zA-Z]\//.test(normalizedPath)) {
    normalizedPath = normalizedPath[1].toUpperCase() + ':' + normalizedPath.slice(2)
  }

  process.env.DATABASE_URL = `file:${normalizedPath}`
}

normalizeDatabaseUrl()

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma


