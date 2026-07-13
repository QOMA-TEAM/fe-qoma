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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ImageIcon, Loader2 } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useAddBahanBaku, useUpdateBahanBaku, useDeleteBahanBaku } from "@/hooks/owner/use-bahan-baku"
import { toast } from "sonner"

const satuanOptions = ["pcs", "kg", "gram", "liter", "porsi", "lusin", "botol", "sachet"]

interface BahanBakuFormData {
  gambar: File | null
  gambarPreview: string | null
  namaBahanBaku: string
  satuan: string
  hargaDefault: number | string
}

interface BahanBakuFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "tambah" | "edit"
  initialData?: {
    id?: string
    namaBahanBaku: string
    satuan: string
    hargaDefault: number
    gambarUrl?: string
  }
}

export function BahanBakuFormDialog({
  open,
  onOpenChange,
  mode,
  initialData,
}: BahanBakuFormDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const addMutation = useAddBahanBaku()
  const updateMutation = useUpdateBahanBaku()
  const deleteMutation = useDeleteBahanBaku()

  const isPending = addMutation.isPending || updateMutation.isPending || deleteMutation.isPending

  const [form, setForm] = useState<BahanBakuFormData>({
    gambar: null,
    gambarPreview: null,
    namaBahanBaku: "",
    satuan: "",
    hargaDefault: "",
  })

  useEffect(() => {
    if (open && mode === "edit" && initialData) {
      setForm({
        gambar: null,
        gambarPreview: initialData.gambarUrl ?? null,
        namaBahanBaku: initialData.namaBahanBaku,
        satuan: initialData.satuan,
        hargaDefault: initialData.hargaDefault,
      })
    } else if (open && mode === "tambah") {
      setForm({ gambar: null, gambarPreview: null, namaBahanBaku: "", satuan: "", hargaDefault: "" })
    }
  }, [open, mode, initialData])

  const handleImageClick = () => fileInputRef.current?.click()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setForm((prev) => ({
        ...prev,
        gambar: file,
        gambarPreview: URL.createObjectURL(file),
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("nama", form.namaBahanBaku)
    formData.append("satuan", form.satuan)
    formData.append("harga_default", form.hargaDefault.toString())
    if (form.gambar) {
      formData.append("gambar", form.gambar)
    }

    if (mode === "tambah") {
      addMutation.mutate(formData, {
        onSuccess: () => {
          onOpenChange(false)
        },
        onError: (err: any) => {
          console.error("Failed to add:", err)
          toast.error(err.response?.data?.message || "Gagal menambahkan bahan baku")
        }
      })
    } else if (mode === "edit" && initialData?.id) {
      updateMutation.mutate({ id: initialData.id, data: formData }, {
        onSuccess: () => {
          onOpenChange(false)
        },
        onError: (err: any) => {
          console.error("Failed to update:", err)
          toast.error(err.response?.data?.message || "Gagal mengubah bahan baku")
        }
      })
    }
  }

  const title = mode === "tambah" ? "Tambah Bahan Baku" : "Edit Bahan Baku"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">{title}</DialogTitle>
        </DialogHeader>

        <div className="border-t border-gray-200 my-2" />

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">Gambar</Label>
            <div
              onClick={handleImageClick}
              className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              {form.gambarPreview ? (
                <img
                  src={form.gambarPreview}
                  alt="Preview"
                  className="h-full w-full object-contain rounded-lg p-1"
                />
              ) : (
                <>
                  <ImageIcon className="size-10 text-gray-300 mb-2" />
                  <span className="text-sm text-gray-400">Klik untuk upload gambar</span>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Nama Bahan Baku */}
          <div className="space-y-2">
            <Label htmlFor="namaBahanBaku" className="text-sm font-semibold text-gray-700">
              Nama Bahan Baku
            </Label>
            <Input
              id="namaBahanBaku"
              placeholder="Nama Bahan Baku"
              value={form.namaBahanBaku}
              onChange={(e) => setForm((p) => ({ ...p, namaBahanBaku: e.target.value }))}
              className="rounded-lg border-gray-300"
              required
            />
          </div>

          {/* Satuan */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">Satuan</Label>
            <Select value={form.satuan} onValueChange={(v) => setForm((p) => ({ ...p, satuan: v }))} required>
              <SelectTrigger className="rounded-lg border-gray-300">
                <SelectValue placeholder="Pilih Satuan" />
              </SelectTrigger>
              <SelectContent>
                {satuanOptions.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* hargaDefault */}
          <div className="space-y-2">
            <Label htmlFor="hargaDefault" className="text-sm font-semibold text-gray-700">
              Harga Default
            </Label>
            <Input
              id="hargaDefault"
              type="number"
              min={0}
              placeholder="10000"
              value={form.hargaDefault}
              onChange={(e) => setForm((p) => ({ ...p, hargaDefault: e.target.value === "" ? "" : Number(e.target.value) }))}
              className="rounded-lg border-gray-300"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <Button disabled={isPending} type="submit" className="rounded-lg px-8 bg-[#1D5E84] hover:bg-[#154663] text-white font-semibold cursor-pointer">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
