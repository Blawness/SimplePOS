"use client"

import useSWR from 'swr'
import { useCartStore } from '@/store/cart'
import { useToast } from '@/hooks/use-toast'

import { ProductCard } from '@/components/pos/product-card'
import { CartView } from '@/components/pos/cart-view'
import { ScrollArea } from '@/components/ui/scroll-area'
import { fetcher } from '@/lib/utils'

export default function PosPage () {
  const { addItem } = useCartStore()
  const { toast } = useToast()
  const { data: products } = useSWR('/api/products', fetcher)

  const handleAddToCart = (product: any) => {
    if (product.stock > 0) {
      addItem(product)
      toast({
        title: "Ditambahkan ke Keranjang",
        description: `${product.name} telah ditambahkan.`,
      })
    } else {
      toast({
        title: "Stok Habis",
        description: `${product.name} tidak tersedia.`,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
      {/* Product List */}
      <div className="lg:col-span-2 h-full">
         <ScrollArea className="h-full pr-4">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {products?.map((product: any) => (
                <ProductCard
                key={product.id}
                product={product}
                onClick={() => handleAddToCart(product)}
                />
            ))}
            </div>
        </ScrollArea>
      </div>

      {/* Cart */}
      <div className="lg:col-span-1 h-full">
        <CartView />
      </div>
    </div>
  )
}
