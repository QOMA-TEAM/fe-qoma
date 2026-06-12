"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { useUpdateMeja } from "@/hooks/outlet/use-meja"
import type { Meja } from "@/services/outlet/meja-service"

interface EditMejaDialogProps {
  meja: Meja | null
  onClose: () => void
}

export function EditMejaDialog({ meja, onClose }: EditMejaDialogProps) {
  const [nomorMeja, setNomorMeja] = useState<string>("")
  const [status, setStatus] = useState<string>("Tersedia")
  const { mutate: updateMeja, isPending } = useUpdateMeja()

  useEffect(() => {
    if (meja) {
      setNomorMeja(meja.nomor_meja)
      setStatus(meja.status)
    }
  }, [meja])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!meja || !nomorMeja.trim()) return

    updateMeja(
      { id: meja.id, nomorMeja, status },
      {
        onSuccess: () => {
          onClose()
        },
      }
    )
  }

  if (!meja) return null

  return (
    <Dialog open={!!meja} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="sm:max-w-[400px] overflow-hidden bg-white border-0 rounded-2xl shadow-xl p-6">
        <DialogHeader className="pb-3 border-b border-gray-100">
          <DialogTitle className="text-xl font-bold text-gray-800">
            Edit Meja
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Nomor / Nama Meja</label>
            <Input
              type="text"
              value={nomorMeja}
              onChange={(e) => setNomorMeja(e.target.value)}
              className="h-11 bg-white border border-gray-200 text-gray-900 rounded-lg shadow-sm focus-visible:ring-1 focus-visible:ring-blue-500 font-medium"
              required
              disabled={isPending}
            />
          </div>



          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="rounded-lg px-5 h-11 bg-white hover:bg-gray-50 text-gray-700 border-gray-200 font-medium cursor-pointer"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="rounded-lg px-6 h-11 bg-[#FB6300] hover:bg-[#e55a00] text-white font-medium shadow-sm cursor-pointer"
            >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
