import { prisma } from '@/lib/prisma'
import { ProductsClient } from '@/components/products/client'
import { redirect } from 'next/navigation'
import { getAuthenticatedUser, userHasPermission } from '@/lib/auth'

// This is a server component that fetches data
export default async function ProductsPage() {
  const user = await getAuthenticatedUser()
  if (!user || !userHasPermission(user, 'product.read')) redirect('/dashboard')
  const fetchedProducts = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  })

  return <ProductsClient products={fetchedProducts} />
}
