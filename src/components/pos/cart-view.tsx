"use client"

import React, { useRef, useState, useEffect } from "react"
import { useReactToPrint } from "react-to-print"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useCartStore } from "@/store/cart"
import { useToast } from "@/hooks/use-toast"
import { CartTable } from "./cart-table"
import { ReceiptPreview } from "./receipt-preview"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

export function CartView() {
  const { items, getTotalPrice, clearCart } = useCartStore()
  const { toast } = useToast()
  const [isClient, setIsClient] = useState(false)

  const receiptRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    onAfterPrint: () => {
      clearCart()
      toast({
        title: "Transaksi Berhasil",
        description: "Keranjang telah dikosongkan.",
      })
    },
  })

  const processPayment = () => {
    if (items.length === 0) {
      toast({
        title: "Keranjang Kosong",
        description: "Tambahkan produk ke keranjang terlebih dahulu.",
        variant: "destructive",
      })
      return
    }
    handlePrint()
  }

  useEffect(() => {
    setIsClient(true)
  }, [])

  const totalPrice = getTotalPrice()
  const isCartEmpty = items.length === 0

  if (!isClient) {
    return (
        <Card>
            <CardHeader><CardTitle>Keranjang</CardTitle></CardHeader>
            <CardContent>
                <div className="text-center p-8">Memuat keranjang...</div>
            </CardContent>
        </Card>
    )
  }


  return (
    <>
      <div className="hidden">
        <ReceiptPreview ref={receiptRef} items={items} total={totalPrice} />
      </div>
      <Card className="flex flex-col h-full">
        <CardHeader>
          <CardTitle>Keranjang</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <CartTable />
        </CardContent>
        <CardFooter className="flex-col !p-6 !items-stretch gap-4">
          <Separator />
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Pajak (10%)</span>
              <span>{formatCurrency(totalPrice * 0.1)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatCurrency(totalPrice * 1.1)}</span>
            </div>
          </div>
          <Separator />
          <div>
            <Label className="mb-2 block">Metode Pembayaran</Label>
            <RadioGroup defaultValue="cash" className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash">Tunai</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card">Non-Tunai</Label>
              </div>
            </RadioGroup>
          </div>
          <Button className="w-full mt-2" size="lg" onClick={processPayment} disabled={isCartEmpty}>
            Proses Pembayaran
          </Button>
        </CardFooter>
      </Card>
    </>
  )
}
