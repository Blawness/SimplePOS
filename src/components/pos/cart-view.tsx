
"use client"

import React, { useRef, useEffect, useState } from "react"
import { useReactToPrint } from "react-to-print"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/store/cart"
import { useToast } from "@/hooks/use-toast"
import { CartTable } from "./cart-table"
import { ReceiptPreview } from "./receipt-preview"
import { PaymentConfirmationDialog } from "./payment-confirmation-dialog"
import { PaymentResultDialog } from "./payment-result-dialog"
import type { CartItem } from "@/lib/types"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

export function CartView() {
  const [isClient, setIsClient] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [showPaymentResultDialog, setShowPaymentResultDialog] = useState(false)
  const [orderName, setOrderName] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [paymentSuccess, setPaymentSuccess] = useState(true)
  const [paymentErrorMessage, setPaymentErrorMessage] = useState("")
  
  // Separate receipt state to preserve data during printing
  const [receiptData, setReceiptData] = useState({
    items: [] as CartItem[],
    total: 0,
    tax: 0,
    orderName: "",
    paymentMethod: ""
  })
  
  const { items, getTotalPrice, clearCart } = useCartStore()
  const { toast } = useToast()
  const receiptRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handlePrint = useReactToPrint({
    // v3 API avoids findDOMNode by using a ref directly
    contentRef: receiptRef,
    documentTitle: "Struk Pembayaran",
    onAfterPrint: async () => {
      try {
        const total = getTotalPrice()
        await fetch('/api/transactions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ total }) })
      } catch {}
      // Cart clearing is now handled in the payment result dialog
    },
  })

  const processPayment = () => {
    if (items.length === 0) {
      toast({
        title: "Keranjang Kosong",
        description: "Mohon tambahkan produk ke keranjang sebelum melanjutkan pembayaran.",
        variant: "destructive",
      })
      return
    }
    setShowPaymentDialog(true)
  }

  const handlePaymentConfirm = async (orderNameValue: string, paymentMethodValue: string) => {
    setShowPaymentDialog(false)
    setOrderName(orderNameValue)
    setPaymentMethod(paymentMethodValue)
    
    // Capture receipt data immediately when payment is confirmed
    const currentTotal = getTotalPrice()
    const currentTax = currentTotal * 0.11
    setReceiptData({
      items: [...items],
      total: currentTotal,
      tax: currentTax,
      orderName: orderNameValue,
      paymentMethod: paymentMethodValue
    })
    
    try {
      // Simulate payment processing
      setPaymentSuccess(true)
      setPaymentErrorMessage("")
      
      // Show payment result dialog
      setShowPaymentResultDialog(true)
    } catch (error) {
      setPaymentSuccess(false)
      setPaymentErrorMessage("Gagal memproses pembayaran. Silakan coba lagi.")
      setShowPaymentResultDialog(true)
    }
  }

  const handlePrintReceipt = () => {
    // Use the preserved receipt data for printing
    handlePrint()
    
    // Clear cart and show success message after printing
    setTimeout(() => {
      clearCart()
      setOrderName("")
      setPaymentMethod("")
      setReceiptData({
        items: [],
        total: 0,
        tax: 0,
        orderName: "",
        paymentMethod: ""
      })
      toast({
        title: "Transaksi Berhasil",
        description: "Pembayaran telah diproses dan keranjang belanja dikosongkan.",
      })
    }, 1000) // Wait after printing to clear cart
  }

  const totalPrice = getTotalPrice()
  const tax = totalPrice * 0.11
  const totalWithTax = totalPrice + tax
  const isCartEmpty = items.length === 0

  if (!isClient) {
    return (
      <Card className="flex flex-col h-full">
        <CardHeader>
          <CardTitle>Keranjang</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto p-6">
          <div className="text-center p-8 text-muted-foreground">Memuat keranjang...</div>
        </CardContent>
        <CardFooter className="flex-col !p-6 !items-stretch gap-4 bg-muted/20">
            <Button className="w-full mt-2" size="lg" disabled>
                Proses Pembayaran
            </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <>
      <div className="hidden">
        <ReceiptPreview 
          ref={receiptRef} 
          items={receiptData.items} 
          total={receiptData.total} 
          tax={receiptData.tax}
          orderName={receiptData.orderName}
          paymentMethod={receiptData.paymentMethod}
        />
        {/* Debug info */}
        <div style={{display: 'none'}}>
          Debug: orderName="{receiptData.orderName}", paymentMethod="{receiptData.paymentMethod}"
        </div>
      </div>
      <Card className="flex flex-col h-full">
        <CardHeader>
          <CardTitle>Keranjang</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <CartTable />
        </CardContent>
        <CardFooter className="flex-col !p-6 !items-stretch gap-4 bg-muted/20">
          <Separator />
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Pajak (11%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatCurrency(totalWithTax)}</span>
            </div>
          </div>
          <Separator />
          <Button className="w-full mt-2" size="lg" onClick={processPayment} disabled={isCartEmpty}>
            Proses Pembayaran
          </Button>
        </CardFooter>
      </Card>
      
      {/* Payment Confirmation Dialog */}
      <PaymentConfirmationDialog
        isOpen={showPaymentDialog}
        onClose={() => setShowPaymentDialog(false)}
        onConfirm={handlePaymentConfirm}
        totalAmount={totalWithTax}
      />
      
      {/* Payment Result Dialog */}
      <PaymentResultDialog
        isOpen={showPaymentResultDialog}
        onClose={() => {
          setShowPaymentResultDialog(false)
          // If user closes without printing, clear cart for successful payments
          if (paymentSuccess) {
            clearCart()
            setOrderName("")
            setPaymentMethod("")
            setReceiptData({
              items: [],
              total: 0,
              tax: 0,
              orderName: "",
              paymentMethod: ""
            })
            toast({
              title: "Transaksi Berhasil",
              description: "Pembayaran telah diproses dan keranjang belanja dikosongkan.",
            })
          }
        }}
        onPrint={handlePrintReceipt}
        isSuccess={paymentSuccess}
        orderName={receiptData.orderName}
        paymentMethod={receiptData.paymentMethod}
        totalAmount={receiptData.total + receiptData.tax}
        errorMessage={paymentErrorMessage}
      />
    </>
  )
}
