import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET () {
  const products = await prisma.product.findMany({ include: { category: true } })
  return NextResponse.json(products)
}

export async function POST (req: Request) {
  const body = await req.json()
  const { name, price, stock, categoryId, image } = body
  if (!name || !price || !categoryId || !image) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
  const created = await prisma.product.create({
    data: { name, price, stock, categoryId, image }
  })
  const withCategory = await prisma.product.findUnique({ where: { id: created.id }, include: { category: true } })
  return NextResponse.json(withCategory, { status: 201 })
}

