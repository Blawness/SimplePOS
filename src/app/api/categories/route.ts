import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser, userHasPermission } from '@/lib/auth'

export async function GET () {
  const me = await getAuthenticatedUser()
  if (!me || !userHasPermission(me, 'product.read')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })
  return NextResponse.json(categories)
}

