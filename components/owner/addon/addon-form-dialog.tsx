import * as React from "react"
import { Loader2 } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Addon } from "@/services/owner/addon"
import { useCreateAddon, useUpdateAddon } from "@/hooks/owner/use-addon"
import { toast } from "sonner"

interface AddonFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "tambah" | "edit"
  initialData?: Addon | null
}

export function AddonFormDialog({ open, onOpenChange, mode, initialData }: AddonFormDialogProps) {
  const isEditing = mode === "edit"
  const addon = initialData
  const createAddon = useCreateAddon()
  const updateAddon = useUpdateAddon()

  const [nama, setNama] = React.useState("")
  const [harga, setHarga] = React.useState("")
  const [errors, setErrors] = React.useState<{nama?: string, harga?: string}>({})

  React.useEffect(() => {
    if (open) {
      if (addon) {
        setNama(addon.nama)
        setHarga(addon.harga.toString())
      } else {
        setNama("")
        setHarga("")
      }
      setErrors({})
    }
  }, [open, addon])

  const validate = () => {
    const newErrors: {nama?: string, harga?: string} = {}
    if (!nama.trim()) {
      newErrors.nama = "Nama addon harus diisi"
    } else if (nama.length > 100) {
      newErrors.nama = "Maksimal 100 karakter"
    }
    
    if (harga === "") {
      newErrors.harga = "Harga harus diisi"
    } else if (Number(harga) < 0) {
      newErrors.harga = "Harga minimal 0"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return
    
    const payload = {
      nama: nama.trim(),
      harga: Number(harga)
    }

    if (isEditing && addon) {
      updateAddon.mutate(
        { id: addon.id, payload },
        {
          onSuccess: () => {
            toast.success("Add On berhasil diupdate")
            onOpenChange(false)
          },
          onError: () => toast.error("Gagal mengupdate Add On")
        }
      )
    } else {
      createAddon.mutate(payload, {
        onSuccess: () => {
          toast.success("Add On berhasil ditambahkan")
          onOpenChange(false)
        },
        onError: () => toast.error("Gagal menambahkan Add On")
      })
    }
  }

  const isPending = createAddon.isPending || updateAddon.isPending

  const title = isEditing ? "Edit Add On" : "Tambah Add On"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">{title}</DialogTitle>
        </DialogHeader>

        <div className="border-t border-gray-200 my-2" />

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="nama" className="text-sm font-semibold text-gray-700">Nama Add On</Label>
            <Input 
              id="nama" 
              placeholder="Contoh: Ekstra Keju" 
              value={nama}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNama(e.target.value)}
              className="rounded-lg border-gray-300"
              disabled={isPending}
            />
            {errors.nama && (
              <p className="text-sm font-medium text-destructive">{errors.nama}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="harga" className="text-sm font-semibold text-gray-700">Harga (Rp)</Label>
            <Input 
              id="harga" 
              type="number" 
              min="0" 
              placeholder="0" 
              value={harga}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHarga(e.target.value)}
              className="rounded-lg border-gray-300"
              disabled={isPending}
            />
            {errors.harga && (
              <p className="text-sm font-medium text-destructive">{errors.harga}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <Button type="submit" disabled={isPending} className="rounded-lg px-8 bg-[#1D5E84] hover:bg-[#154663] text-white font-semibold cursor-pointer">
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : isEditing ? "Update" : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
