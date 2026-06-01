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
import { QrCode, CreditCard, Loader2 } from "lucide-react"
import { useUpgradePlan } from "@/hooks/owner/use-subscription"
import { toast } from "sonner"

interface UpgradePlanDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  planId: string
}

export function UpgradePlanDialog({ open, onOpenChange, planId }: UpgradePlanDialogProps) {
  const [metode, setMetode] = useState("")
  const [step, setStep] = useState(1)
  const [instruksi, setInstruksi] = useState("")
  const upgradeMutation = useUpgradePlan()

  useEffect(() => {
    if (!open) {
      // Reset state when dialog closes to prevent flash of old state when opening
      const timer = setTimeout(() => {
        setStep(1)
        setMetode("")
        setInstruksi("")
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1) {
      if (!metode || !planId) return
      
      const payloadMetode = metode === "transfer_bank" ? "transfer" : "qris"

      upgradeMutation.mutate({ plan_id: planId, metode_pembayaran: payloadMetode }, {
        onSuccess: (data) => {
          toast.success("Request upgrade berhasil dikirim!")
          setInstruksi(data.instruksi || "")
          setStep(2)
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Gagal melakukan upgrade plan")
        }
      })
    } else {
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
              <Select value={metode} onValueChange={setMetode} required disabled={upgradeMutation.isPending}>
                <SelectTrigger className="w-full border-gray-300 rounded-lg cursor-pointer">
                  <SelectValue placeholder="Pilih Metode pembayaran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transfer_bank" className="cursor-pointer">Transfer Bank</SelectItem>
                  <SelectItem value="qris" className="cursor-pointer">QRIS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-center gap-4 pt-2 ">
              <Button
                type="button"
                variant="destructive"
                disabled={upgradeMutation.isPending}
                onClick={() => onOpenChange(false)}
                className="rounded-lg px-10 bg-[#dc2626] hover:bg-red-700 text-white font-medium cursor-pointer"
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                disabled={!metode || upgradeMutation.isPending}
                className="rounded-lg px-10 bg-[#1d4ed8] hover:bg-blue-800 text-white font-medium disabled:opacity-50 cursor-pointer"
              >
                {upgradeMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Next"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center justify-center border border-gray-100 text-center">
              {metode === "qris" ? (
                <>
                  <QrCode className="w-32 h-32 text-gray-800 mb-4" />
                  <p className="text-sm font-medium text-gray-800 mb-2">Instruksi Pembayaran:</p>
                  <p className="text-sm text-gray-600">{instruksi}</p>
                </>
              ) : (
                <>
                  <CreditCard className="w-16 h-16 text-blue-600 mb-4" />
                  <p className="text-sm font-medium text-gray-800 mb-2">Instruksi Pembayaran:</p>
                  <p className="text-sm text-gray-600">{instruksi}</p>
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
