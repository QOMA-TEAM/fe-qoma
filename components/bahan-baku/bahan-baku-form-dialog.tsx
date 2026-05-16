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
import { ImageIcon } from "lucide-react"
import { useState, useRef, useEffect } from "react"

const satuanOptions = ["Pcs", "Kg", "Gram", "Liter", "Ml", "Pack", "Buah", "Ikat"]

interface BahanBakuFormData {
  gambar: File | null
  gambarPreview: string | null
  namaBahanBaku: string
  satuan: string
  peringatanStock: number
}

interface BahanBakuFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "tambah" | "edit"
  initialData?: {
    namaBahanBaku: string
    satuan: string
    peringatanStock: number
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
  const [form, setForm] = useState<BahanBakuFormData>({
    gambar: null,
    gambarPreview: null,
    namaBahanBaku: "",
    satuan: "",
    peringatanStock: 5,
  })

  useEffect(() => {
    if (open && mode === "edit" && initialData) {
      setForm({
        gambar: null,
        gambarPreview: initialData.gambarUrl ?? null,
        namaBahanBaku: initialData.namaBahanBaku,
        satuan: initialData.satuan,
        peringatanStock: initialData.peringatanStock,
      })
    } else if (open && mode === "tambah") {
      setForm({ gambar: null, gambarPreview: null, namaBahanBaku: "", satuan: "", peringatanStock: 5 })
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
    // TODO: Submit to API
    console.log(`${mode}:`, form)
    onOpenChange(false)
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
            <Select value={form.satuan} onValueChange={(v) => setForm((p) => ({ ...p, satuan: v }))}>
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

          {/* Peringatan Stock Menipis */}
          <div className="space-y-2">
            <Label htmlFor="peringatanStock" className="text-sm font-semibold text-gray-700">
              Peringatan Stock Menipis
            </Label>
            <Input
              id="peringatanStock"
              type="number"
              min={0}
              placeholder="5"
              value={form.peringatanStock}
              onChange={(e) => setForm((p) => ({ ...p, peringatanStock: Number(e.target.value) }))}
              className="rounded-lg border-gray-300"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-4 pt-2">
            {mode === "edit" && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  console.log("Hapus Item", initialData?.namaBahanBaku)
                  onOpenChange(false)
                }}
                className="rounded-full px-8 bg-red-600 hover:bg-red-700 text-white font-semibold"
              >
                Hapus
              </Button>
            )}
            
            <Button type="submit" className="rounded-full px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
