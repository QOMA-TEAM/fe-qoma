"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { useAddKategori, useUpdateKategori, useDeleteKategori } from "@/hooks/owner/use-kategori"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

interface KategoriFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "tambah" | "edit"
  initialData?: { id: string; nama: string }
}

export function KategoriFormDialog({
  open,
  onOpenChange,
  mode,
  initialData,
}: KategoriFormDialogProps) {
  const [namaKategori, setNamaKategori] = useState("")

  const addMutation = useAddKategori()
  const updateMutation = useUpdateKategori()
  const deleteMutation = useDeleteKategori()

  const isPending = addMutation.isPending || updateMutation.isPending || deleteMutation.isPending
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (open && mode === "edit" && initialData) {
      setNamaKategori(initialData.nama)
    } else if (open && mode === "tambah") {
      setNamaKategori("")
    }
  }, [open, mode, initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (mode === "tambah") {
      addMutation.mutate(namaKategori, {
        onSuccess: () => {
          toast.success("Kategori berhasil ditambahkan")
          onOpenChange(false)
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Gagal menambahkan kategori")
        }
      })
    } else if (mode === "edit" && initialData) {
      updateMutation.mutate({ id: initialData.id, nama: namaKategori }, {
        onSuccess: () => {
          toast.success("Kategori berhasil diupdate")
          onOpenChange(false)
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Gagal mengupdate kategori")
        }
      })
    }
  }

  const handleDelete = () => {
    if (!initialData) return
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    if (!initialData) return
    deleteMutation.mutate(initialData.id, {
      onSuccess: () => {
        toast.success("Kategori berhasil dihapus")
        onOpenChange(false)
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Gagal menghapus kategori")
      }
    })
  }

  const title = mode === "tambah" ? "Tambah Kategori" : "Edit Kategori"

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">{title}</DialogTitle>
          </DialogHeader>

          <div className="border-t border-gray-200 my-2" />

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="namaKategori" className="text-sm font-semibold text-gray-700">
                Nama Kategori
              </Label>
              <Input
                id="namaKategori"
                placeholder="Nama Kategori"
                value={namaKategori}
                onChange={(e) => setNamaKategori(e.target.value)}
                className="rounded-lg border-gray-300"
                required
                disabled={isPending}
              />
            </div>

            <div className="flex items-center justify-center gap-4 pt-2">
              <Button type="submit" disabled={isPending} className="rounded-lg px-8 bg-[#1D5E84] hover:bg-[#154663] text-white font-semibold cursor-pointer">
                {addMutation.isPending || updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === "edit" ? "Update" : "Simpan"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Hapus Kategori"
        description={`Apakah Anda yakin ingin menghapus kategori "${initialData?.nama}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Ya, Hapus"
        cancelLabel="Batal"
        variant="danger"
        onConfirm={confirmDelete}
      />
    </>
  )
}
