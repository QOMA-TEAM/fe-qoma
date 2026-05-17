"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState, useEffect } from "react"
import { QrCode, CreditCard, Wallet } from "lucide-react"

interface UpgradePlanDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpgradePlanDialog({ open, onOpenChange }: UpgradePlanDialogProps) {
  const [metode, setMetode] = useState("")
  const [step, setStep] = useState(1)

  useEffect(() => {
    if (open) {
      setStep(1)
      setMetode("")
    }
  }, [open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1) {
      if (!metode) return
      setStep(2)
    } else {
      console.log("Selesai")
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            {step === 1 ? "Upgrade Plan" : "Detail Pembayaran"}
          </DialogTitle>
        </DialogHeader>

        <div className="border-t border-gray-200 my-2" />

        {step === 1 ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                Pilih Metode Pembayaran
              </Label>
              <Select value={metode} onValueChange={setMetode} required>
                <SelectTrigger className="w-full border-gray-300 rounded-lg">
                  <SelectValue placeholder="Pilih Metode pembayaran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transfer_bank">Transfer Bank</SelectItem>
                  <SelectItem value="qris">QRIS</SelectItem>
                  <SelectItem value="ewallet">E-Wallet (OVO/Dana/Gopay)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-center gap-4 pt-2">
              <Button
                type="button"
                variant="destructive"
                onClick={() => onOpenChange(false)}
                className="rounded-lg px-10 bg-[#dc2626] hover:bg-red-700 text-white font-medium"
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                disabled={!metode}
                className="rounded-lg px-10 bg-[#1d4ed8] hover:bg-blue-800 text-white font-medium disabled:opacity-50"
              >
                Next
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center justify-center border border-gray-100 text-center">
              {metode === "qris" ? (
                <>
                  <QrCode className="w-32 h-32 text-gray-800 mb-4" />
                  <p className="text-sm text-gray-600">Scan QR Code di atas menggunakan aplikasi e-wallet atau mobile banking Anda.</p>
                </>
              ) : metode === "transfer_bank" ? (
                <>
                  <CreditCard className="w-16 h-16 text-blue-600 mb-4" />
                  <p className="text-sm font-medium text-gray-500 mb-1">Nomor Virtual Account Bank BCA</p>
                  <p className="text-2xl font-bold tracking-wider text-gray-800">8923 1234 5678</p>
                </>
              ) : (
                <>
                  <Wallet className="w-16 h-16 text-emerald-500 mb-4" />
                  <p className="text-sm text-gray-600 mb-2">Buka aplikasi OVO/Dana/Gopay Anda untuk menyelesaikan pembayaran.</p>
                  <p className="text-xl font-bold text-gray-800">Rp. 100.000</p>
                </>
              )}
            </div>
            
            <div className="flex justify-center pt-2">
              <Button 
                onClick={() => onOpenChange(false)} 
                className="rounded-lg px-10 bg-[#1d4ed8] hover:bg-blue-800 text-white font-medium"
              >
                Selesai
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

