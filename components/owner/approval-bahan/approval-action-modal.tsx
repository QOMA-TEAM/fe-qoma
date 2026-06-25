"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ApprovalBahan } from "@/services/owner/approval-bahan"

interface ApprovalActionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (id: string, catatan: string) => void
  isLoading: boolean
  approval: ApprovalBahan | null
  actionType: "approve" | "reject" | null
}

export function ApprovalActionModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  approval,
  actionType,
}: ApprovalActionModalProps) {
  const [catatan, setCatatan] = useState("")

  if (!approval || !actionType) return null

  const isReject = actionType === "reject"
  const title = isReject ? "Tolak Pengajuan Harga" : "Setujui Pengajuan Harga"
  const description = isReject
    ? `Apakah Anda yakin ingin menolak pengajuan harga baru untuk ${approval.bahan_outlet?.bahan_master?.nama}? Anda wajib memberikan catatan penolakan.`
    : `Apakah Anda yakin ingin menyetujui pengajuan harga baru untuk ${approval.bahan_outlet?.bahan_master?.nama}? Harga akan langsung berubah di outlet.`

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onConfirm(approval.id, catatan)
  }

  // Reset state when closing
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setCatatan("")
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className={isReject ? "text-red-600" : "text-emerald-600"}>
              {title}
            </DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="catatan" className="text-sm font-medium">
                Catatan {isReject && <span className="text-red-500">*</span>}
              </label>
              <Textarea
                id="catatan"
                placeholder={isReject ? "Alasan penolakan..." : "Catatan tambahan (opsional)..."}
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                required={isReject}
                className="resize-none"
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isLoading || (isReject && catatan.length < 5)}
              className={
                isReject
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }
            >
              {isLoading ? "Memproses..." : isReject ? "Tolak Pengajuan" : "Setujui Pengajuan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
