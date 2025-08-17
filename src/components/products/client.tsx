"use client"

import { useState } from 'react'
import { DataTable } from "@/components/ui/data-table"
import { columns } from './columns'
import type { Product } from '@/lib/types'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AddProductDialog } from './add-product-dialog'
import useSWR from 'swr'
import { fetcher } from '@/lib/utils'

interface ProductsClientProps {
  products: Product[]
}

export function ProductsClient({ products }: ProductsClientProps) {
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [nameFilter, setNameFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const { data: categories } = useSWR('/api/categories', fetcher)

  const handleFilterChange = (name: string, category: string) => {
    let newFilteredProducts = products

    if (name) {
      newFilteredProducts = newFilteredProducts.filter((product) =>
        product.name.toLowerCase().includes(name.toLowerCase())
      )
    }

    if (category !== "all") {
      newFilteredProducts = newFilteredProducts.filter(
        (product) => product.category.id === category
      )
    }

    setFilteredProducts(newFilteredProducts)
  }

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value
    setNameFilter(newName)
    handleFilterChange(newName, categoryFilter)
  }

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value)
    handleFilterChange(nameFilter, value)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Produk</h2>
        <AddProductDialog />
      </div>
      <div className="flex items-center gap-4">
        <Input
          placeholder="Saring berdasarkan nama produk..."
          value={nameFilter}
          onChange={handleNameChange}
          className="max-w-sm"
        />
        <Select value={categoryFilter} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Saring berdasarkan kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            {categories?.map((category: { id: string, name: string }) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <DataTable columns={columns} data={filteredProducts} />
    </div>
  )
}
