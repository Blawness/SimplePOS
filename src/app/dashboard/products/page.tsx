import { products } from "@/lib/data"
import { ProductsClient } from "@/components/products/client"

// This is a server component that fetches data
export default async function ProductsPage() {
  // In a real app, you'd fetch this from your database
  const fetchedProducts = products

  return <ProductsClient products={fetchedProducts} />
}
