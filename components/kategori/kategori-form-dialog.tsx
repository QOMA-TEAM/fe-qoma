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

interface KategoriFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "tambah" | "edit"
  initialData?: { namaKategori: string }
}

export function KategoriFormDialog({
  open,
  onOpenChange,
  mode,
  initialData,
}: KategoriFormDialogProps) {
  const [namaKategori, setNamaKategori] = useState("")

  useEffect(() => {
    if (open && mode === "edit" && initialData) {
      setNamaKategori(initialData.namaKategori)
    } else if (open && mode === "tambah") {
      setNamaKategori("")
    }
  }, [open, mode, initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Submit to API
    console.log(`${mode}:`, namaKategori)
    onOpenChange(false)
  }

  const title = mode === "tambah" ? "Tambah Kategori" : "Edit Kategori"

  return (
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
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-4 pt-2">
            {mode === "edit" && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  console.log("Hapus Kategori", initialData?.namaKategori)
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
