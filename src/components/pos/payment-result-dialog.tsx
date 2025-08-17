"use client"

import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Printer } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PaymentResultDialogProps {
  isOpen: boolean
  onClose: () => void
  onPrint: () => void
  isSuccess: boolean
  orderName: string
  paymentMethod: string
  totalAmount: number
  errorMessage?: string
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

export function PaymentResultDialog({
  isOpen,
  onClose,
  onPrint,
  isSuccess,
  orderName,
  paymentMethod,
  totalAmount,
  errorMessage
}: PaymentResultDialogProps) {
  const { toast } = useToast()

  const handlePrint = () => {
    onPrint()
    onClose()
  }

  const handleClose = () => {
    onClose()
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'tunai':
        return '💵'
      case 'qris':
        return '📱'
      case 'debit':
        return '💳'
      default:
        return '💳'
    }
  }

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'tunai':
        return 'TUNAI'
      case 'qris':
        return 'QRIS'
      case 'debit':
        return 'DEBIT'
      default:
        return method.toUpperCase()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {isSuccess ? "Pembayaran Berhasil!" : "Pembayaran Gagal"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Status Icon and Message */}
          <div className="text-center">
            {isSuccess ? (
              <div className="flex flex-col items-center space-y-3">
                <CheckCircle className="h-16 w-16 text-green-500" />
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-green-600">
                    Transaksi Berhasil Diproses
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Pembayaran telah diterima dan diproses
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-3">
                <XCircle className="h-16 w-16 text-red-500" />
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-red-600">
                    Transaksi Gagal
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {errorMessage || "Terjadi kesalahan dalam memproses pembayaran"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Transaction Details */}
          {isSuccess && (
            <div className="bg-muted/20 p-4 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Order:</span>
                <span className="text-sm font-semibold">{orderName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Metode Pembayaran:</span>
                <span className="text-sm font-semibold flex items-center gap-2">
                  {getPaymentMethodIcon(paymentMethod)} {getPaymentMethodLabel(paymentMethod)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Pembayaran:</span>
                <span className="text-lg font-bold text-primary">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {isSuccess ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Tutup
                </Button>
                <Button
                  onClick={handlePrint}
                  className="flex-1 flex items-center gap-2"
                >
                  <Printer className="h-4 w-4" />
                  Cetak Struk
                </Button>
              </>
            ) : (
              <Button
                onClick={handleClose}
                className="flex-1"
                variant="destructive"
              >
                Tutup
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
