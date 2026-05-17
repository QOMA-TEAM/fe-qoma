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
import { ImageIcon, Search, X } from "lucide-react"
import { useState, useRef, useEffect } from "react"

// ── Bahan Baku list (shared from bahan-baku data) ──
const allBahanBaku = [
  "Bawang Putih", "Bawang Merah", "Cabai Merah", "Cabai Hijau", "Tomat",
  "Wortel", "Kentang", "Brokoli", "Kembang Kol", "Bayam",
  "Sawi", "Kacang Panjang", "Timun", "Labu", "Paprika",
  "Zucchini", "Daun Salam", "Jahe", "Kunyit", "Lengkuas",
]

const kategoriOptions = [
  "Makanan Berat", "Makanan Ringan", "Minuman Dingin", "Minuman Panas",
  "Dessert", "Appetizer", "Lauk Pauk", "Sayuran", "Sambal", "Gorengan",
  "Sup & Soto", "Nasi & Mie", "Jus & Smoothie", "Kopi & Teh", "Paket Hemat",
]

interface BahanBakuItem {
  nama: string
  jumlah: number
}

interface MenuFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "tambah" | "edit"
  initialData?: {
    namaMenu: string
    kategori: string
    harga: number
    bahanBaku: BahanBakuItem[]
    gambarUrl?: string
  }
}

export function MenuFormDialog({
  open,
  onOpenChange,
  mode,
  initialData,
}: MenuFormDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [gambarPreview, setGambarPreview] = useState<string | null>(null)
  const [namaMenu, setNamaMenu] = useState("")
  const [kategori, setKategori] = useState("")
  const [harga, setHarga] = useState("")
  const [bahanBaku, setBahanBaku] = useState<BahanBakuItem[]>([])
  const [searchBahan, setSearchBahan] = useState("")

  useEffect(() => {
    if (open && mode === "edit" && initialData) {
      setNamaMenu(initialData.namaMenu)
      setKategori(initialData.kategori)
      setHarga(initialData.harga.toLocaleString("id-ID"))
      setBahanBaku(initialData.bahanBaku)
      setGambarPreview(initialData.gambarUrl ?? null)
      setSearchBahan("")
    } else if (open && mode === "tambah") {
      setNamaMenu("")
      setKategori("")
      setHarga("")
      setBahanBaku([])
      setGambarPreview(null)
      setSearchBahan("")
    }
  }, [open, mode, initialData])

  const handleImageClick = () => fileInputRef.current?.click()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setGambarPreview(URL.createObjectURL(file))
  }

  const addBahanBaku = (nama: string) => {
    if (!bahanBaku.find((b) => b.nama === nama)) {
      setBahanBaku((prev) => [...prev, { nama, jumlah: 1 }])
    }
  }

  const removeBahanBaku = (nama: string) => {
    setBahanBaku((prev) => prev.filter((b) => b.nama !== nama))
  }

  const updateJumlah = (nama: string, jumlah: number) => {
    setBahanBaku((prev) =>
      prev.map((b) => (b.nama === nama ? { ...b, jumlah: Math.max(0, jumlah) } : b))
    )
  }

  const filteredBahan = allBahanBaku.filter((b) =>
    b.toLowerCase().includes(searchBahan.toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(`${mode}:`, { namaMenu, kategori, harga, bahanBaku })
    onOpenChange(false)
  }

  const title = mode === "tambah" ? "Tambah Menu" : "Edit Menu"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">{title}</DialogTitle>
        </DialogHeader>

        <div className="border-t border-gray-200 my-2" />

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ── Left Column ── */}
            <div className="space-y-5">
              {/* Gambar */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Gambar</Label>
                <div
                  onClick={handleImageClick}
                  className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
                >
                  {gambarPreview ? (
                    <img src={gambarPreview} alt="Preview" className="h-full w-full object-contain rounded-lg p-1" />
                  ) : (
                    <>
                      <ImageIcon className="size-10 text-gray-300 mb-2" />
                      <span className="text-sm text-gray-400">Klik untuk upload gambar</span>
                    </>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </div>

              {/* Nama Menu */}
              <div className="space-y-2">
                <Label htmlFor="namaMenu" className="text-sm font-semibold text-gray-700">Nama Menu</Label>
                <Input
                  id="namaMenu"
                  placeholder="Nama Bahan Baku"
                  value={namaMenu}
                  onChange={(e) => setNamaMenu(e.target.value)}
                  className="rounded-lg border-gray-300"
                  required
                />
              </div>

              {/* Bahan Baku Gallery */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold text-gray-700">Nama Bahan Baku</Label>
                  <div className="relative">
                    <Input
                      placeholder="Search"
                      value={searchBahan}
                      onChange={(e) => setSearchBahan(e.target.value)}
                      className="pr-8 h-8 w-32 text-xs border-gray-200 rounded-full"
                    />
                    <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-3 max-h-36 overflow-y-auto">
                  <div className="flex flex-wrap gap-2">
                    {filteredBahan.map((nama) => {
                      const isSelected = bahanBaku.some((b) => b.nama === nama)
                      return (
                        <button
                          key={nama}
                          type="button"
                          onClick={() => (isSelected ? removeBahanBaku(nama) : addBahanBaku(nama))}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                            isSelected
                              ? "bg-emerald-100 border-emerald-400 text-emerald-700 font-semibold"
                              : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {nama}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right Column ── */}
            <div className="space-y-5">
              {/* Kategori */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Kategori</Label>
                <Select value={kategori} onValueChange={setKategori}>
                  <SelectTrigger className="rounded-lg border-gray-300">
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {kategoriOptions.map((k) => (
                      <SelectItem key={k} value={k}>{k}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Selected Bahan Baku List */}
              <div className="space-y-2">
                <div className="border border-gray-200 rounded-lg p-3 min-h-[200px] max-h-[260px] overflow-y-auto space-y-3">
                  {bahanBaku.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-8">Pilih bahan baku dari daftar di sebelah kiri</p>
                  )}
                  {bahanBaku.map((item) => (
                    <div key={item.nama} className="flex items-center gap-3">
                      <div className="flex-1">
                        <Label className="text-xs text-gray-500 mb-1 block">Bahan Baku</Label>
                        <div className="flex items-center gap-1.5">
                          <Input value={item.nama} readOnly className="rounded-lg border-gray-300 bg-gray-50 text-sm h-9" />
                          <button type="button" onClick={() => removeBahanBaku(item.nama)} className="text-gray-400 hover:text-red-500 transition-colors shrink-0">
                            <X className="size-4" />
                          </button>
                        </div>
                      </div>
                      <div className="w-20">
                        <Label className="text-xs text-gray-500 mb-1 block">Jumlah</Label>
                        <Input
                          type="number"
                          min={0}
                          value={item.jumlah}
                          onChange={(e) => updateJumlah(item.nama, Number(e.target.value))}
                          className="rounded-lg border-gray-300 text-sm h-9"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Template Harga */}
              <div className="space-y-2">
                <Label htmlFor="templateHarga" className="text-sm font-semibold text-gray-700">Template harga</Label>
                <Input
                  id="templateHarga"
                  placeholder="Rp. 15.000"
                  value={harga}
                  onChange={(e) => setHarga(e.target.value)}
                  className="rounded-lg border-gray-300"
                  required
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-4 pt-6">
            {mode === "edit" && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  console.log("Hapus Menu", initialData?.namaMenu)
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
