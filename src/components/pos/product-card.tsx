"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
  onClick: () => void
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <Card
      className="cursor-pointer hover:border-primary transition-colors"
      onClick={onClick}
    >
      <CardContent className="p-4 flex flex-col items-center text-center">
        <Image
          src={product.image}
          alt={product.name}
          width={120}
          height={120}
          className="rounded-md mb-4"
          data-ai-hint="product image"
        />
        <h3 className="font-semibold text-base leading-tight mb-1">{product.name}</h3>
        <p className="text-sm text-muted-foreground">{formatCurrency(product.price)}</p>
      </CardContent>
    </Card>
  )
}
