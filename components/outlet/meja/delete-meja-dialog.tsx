"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, AlertTriangle } from "lucide-react"
import { useDeleteMeja } from "@/hooks/outlet/use-meja"
import type { Meja } from "@/services/outlet/meja-service"

interface DeleteMejaDialogProps {
  meja: Meja | null
  onClose: () => void
}

export function DeleteMejaDialog({ meja, onClose }: DeleteMejaDialogProps) {
  const { mutate: deleteMeja, isPending } = useDeleteMeja()

  const handleDelete = () => {
    if (!meja) return

    deleteMeja(meja.id, {
      onSuccess: () => {
        onClose()
      },
    })
  }

  if (!meja) return null

  return (
    <Dialog open={!!meja} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="sm:max-w-[400px] overflow-hidden bg-white border-0 rounded-2xl shadow-xl p-6">
        <DialogHeader className="flex flex-col items-center text-center pb-3 border-b border-gray-100">
          <div className="size-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-3">
            <AlertTriangle className="size-6" />
          </div>
          <DialogTitle className="text-xl font-bold text-gray-800">
            Hapus Meja
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4 text-center">
          <p className="text-sm text-gray-600">
            Apakah Anda yakin ingin menghapus <span className="font-semibold text-gray-950">{meja.nomor_meja}</span>?
          </p>
          <p className="text-xs text-red-500 font-medium bg-red-50 p-2.5 rounded-lg border border-red-100">
            Tindakan ini tidak dapat dibatalkan. Meja tidak dapat dihapus jika memiliki pesanan aktif.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="rounded-lg px-5 h-11 bg-white hover:bg-gray-50 text-gray-700 border-gray-200 font-medium cursor-pointer w-full"
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="rounded-lg px-6 h-11 bg-red-600 hover:bg-red-700 text-white font-medium shadow-sm cursor-pointer w-full"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Hapus"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
