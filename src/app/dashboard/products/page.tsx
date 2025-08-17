import { prisma } from '@/lib/prisma'
import { ProductsClient } from '@/components/products/client'

// This is a server component that fetches data
export default async function ProductsPage() {
  const fetchedProducts = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  })

  return <ProductsClient products={fetchedProducts} />
}
