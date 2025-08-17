"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

interface PaymentConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (orderName: string, paymentMethod: string) => void
  totalAmount: number
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

export function PaymentConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  totalAmount
}: PaymentConfirmationDialogProps) {
  const [orderName, setOrderName] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("tunai")
  const { toast } = useToast()

  const handleConfirm = () => {
    if (!orderName.trim()) {
      toast({
        title: "Nama Order Diperlukan",
        description: "Mohon isi nama order sebelum melanjutkan.",
        variant: "destructive",
      })
      return
    }

    onConfirm(orderName, paymentMethod)
  }

  const handleClose = () => {
    setOrderName("")
    setPaymentMethod("tunai")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Konfirmasi Pembayaran</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Order Name Input */}
          <div className="space-y-2">
            <Label htmlFor="orderName">Nama Order</Label>
            <Input
              id="orderName"
              placeholder="Masukkan nama order"
              value={orderName}
              onChange={(e) => setOrderName(e.target.value)}
            />
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Metode Pembayaran</Label>
            <RadioGroup
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              className="grid grid-cols-1 gap-3"
            >
              <label 
                htmlFor="tunai" 
                className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <RadioGroupItem value="tunai" id="tunai" />
                <span className="font-medium">💵 Tunai</span>
              </label>
              
              <label 
                htmlFor="qris" 
                className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <RadioGroupItem value="qris" id="qris" />
                <span className="font-medium">📱 QRIS</span>
              </label>
              
              <label 
                htmlFor="debit" 
                className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <RadioGroupItem value="debit" id="debit" />
                <span className="font-medium">💳 Debit</span>
              </label>
            </RadioGroup>
          </div>

          <Separator />

          {/* Total Amount Display */}
          <div className="bg-muted/20 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">Total Pembayaran</span>
              <span className="text-2xl font-bold text-primary">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1"
              disabled={!orderName.trim()}
            >
              Konfirmasi Pembayaran
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
