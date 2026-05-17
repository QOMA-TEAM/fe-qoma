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
import { ImageIcon, Search, X, Loader2 } from "lucide-react"
import { useState, useRef, useEffect } from "react"

import { useKategori } from "@/hooks/use-kategori"
import { useBahanBaku } from "@/hooks/use-bahan-baku"
import { useAddMenu, useUpdateMenu, useDeleteMenu } from "@/hooks/use-menu"

interface BahanBakuItem {
  bahan_master_id: string
  nama: string
  jumlah: number
  satuan?: string
}

interface MenuFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "tambah" | "edit"
  initialData?: {
    id?: string
    namaMenu: string
    kategori_id: string
    harga: number
    keterangan: string
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
  
  // Data Fetching
  const { data: kategoriResponse } = useKategori(1, "", 1000)
  const { data: bahanBakuResponse } = useBahanBaku(1, "", 1000)
  
  const kategoriOptions = kategoriResponse?.data || []
  const allBahanBaku = bahanBakuResponse?.data || []

  // Mutations
  const addMutation = useAddMenu()
  const updateMutation = useUpdateMenu()
  const deleteMutation = useDeleteMenu()

  // State
  const [gambarPreview, setGambarPreview] = useState<string | null>(null)
  const [gambarFile, setGambarFile] = useState<File | null>(null)
  const [namaMenu, setNamaMenu] = useState("")
  const [kategoriId, setKategoriId] = useState("")
  const [harga, setHarga] = useState("")
  const [keterangan, setKeterangan] = useState("")
  const [bahanBaku, setBahanBaku] = useState<BahanBakuItem[]>([])
  const [searchBahan, setSearchBahan] = useState("")

  useEffect(() => {
    if (open && mode === "edit" && initialData) {
      setNamaMenu(initialData.namaMenu)
      setKategoriId(initialData.kategori_id)
      setHarga(initialData.harga.toString())
      setKeterangan(initialData.keterangan || "")
      setBahanBaku(initialData.bahanBaku)
      setGambarPreview(initialData.gambarUrl ?? null)
      setGambarFile(null)
      setSearchBahan("")
    } else if (open && mode === "tambah") {
      setNamaMenu("")
      setKategoriId("")
      setHarga("")
      setKeterangan("")
      setBahanBaku([])
      setGambarPreview(null)
      setGambarFile(null)
      setSearchBahan("")
    }
  }, [open, mode, initialData])

  const handleImageClick = () => fileInputRef.current?.click()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setGambarFile(file)
      setGambarPreview(URL.createObjectURL(file))
    }
  }

  const addBahanBakuItem = (bahan: { id: string, nama: string, satuan: string }) => {
    if (!bahanBaku.find((b) => b.bahan_master_id === bahan.id)) {
      setBahanBaku((prev) => [...prev, { bahan_master_id: bahan.id, nama: bahan.nama, satuan: bahan.satuan, jumlah: 1 }])
    }
  }

  const removeBahanBakuItem = (id: string) => {
    setBahanBaku((prev) => prev.filter((b) => b.bahan_master_id !== id))
  }

  const updateJumlah = (id: string, jumlah: number) => {
    setBahanBaku((prev) =>
      prev.map((b) => (b.bahan_master_id === id ? { ...b, jumlah: Math.max(0, jumlah) } : b))
    )
  }

  const filteredBahan = allBahanBaku.filter((b) =>
    b.nama.toLowerCase().includes(searchBahan.toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!kategoriId) {
      alert("Pilih kategori terlebih dahulu.")
      return
    }

    const formData = new FormData()
    formData.append("nama", namaMenu)
    formData.append("kategori_id", kategoriId)
    formData.append("harga_default", harga)
    formData.append("keterangan", keterangan)
    formData.append("is_active", "1")
    
    if (gambarFile) {
      formData.append("gambar", gambarFile)
    }

    bahanBaku.forEach((item, index) => {
      formData.append(`bahan_baku[${index}][bahan_master_id]`, item.bahan_master_id)
      formData.append(`bahan_baku[${index}][jumlah_pakai]`, item.jumlah.toString())
    })

    if (mode === "tambah") {
      addMutation.mutate(formData, {
        onSuccess: () => onOpenChange(false),
        onError: (err: any) => alert(err.response?.data?.message || "Gagal menambahkan menu")
      })
    } else if (mode === "edit" && initialData?.id) {
      updateMutation.mutate({ id: initialData.id, data: formData }, {
        onSuccess: () => onOpenChange(false),
        onError: (err: any) => alert(err.response?.data?.message || "Gagal memperbarui menu")
      })
    }
  }

  const handleDelete = () => {
    if (!initialData?.id) return
    const confirmed = window.confirm(`Hapus menu ${initialData.namaMenu}?`)
    if (!confirmed) return

    deleteMutation.mutate(initialData.id, {
      onSuccess: () => onOpenChange(false),
      onError: (err: any) => alert(err.response?.data?.message || "Gagal menghapus menu")
    })
  }

  const isPending = addMutation.isPending || updateMutation.isPending || deleteMutation.isPending

  const title = mode === "tambah" ? "Tambah Menu" : "Edit Menu"

  return (
    <Dialog open={open} onOpenChange={isPending ? undefined : onOpenChange}>
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
                  placeholder="Contoh: Nasi Goreng Spesial"
                  value={namaMenu}
                  onChange={(e) => setNamaMenu(e.target.value)}
                  className="rounded-lg border-gray-300"
                  required
                />
              </div>

              {/* Bahan Baku Gallery */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold text-gray-700">Resep (Bahan Baku)</Label>
                  <div className="relative">
                    <Input
                      placeholder="Cari..."
                      value={searchBahan}
                      onChange={(e) => setSearchBahan(e.target.value)}
                      className="pr-8 h-8 w-32 text-xs border-gray-200 rounded-full"
                    />
                    <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-3 max-h-[220px] overflow-y-auto">
                  <div className="grid grid-cols-3 gap-3">
                    {filteredBahan.length === 0 ? (
                       <p className="text-xs text-gray-400 py-2 col-span-3 text-center">Bahan baku tidak ditemukan.</p>
                    ) : (
                      filteredBahan.map((bahan) => {
                        const isSelected = bahanBaku.some((b) => b.bahan_master_id === bahan.id)
                        return (
                          <button
                            key={bahan.id}
                            type="button"
                            onClick={() => (isSelected ? removeBahanBakuItem(bahan.id) : addBahanBakuItem(bahan))}
                            className={`flex flex-col items-center overflow-hidden rounded-xl border transition-all ${
                              isSelected
                                ? "border-emerald-500 ring-1 ring-emerald-500 bg-emerald-50"
                                : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                            }`}
                          >
                            <div className="w-full aspect-square bg-gray-100 flex items-center justify-center p-1">
                              {bahan.gambar ? (
                                <img 
                                  src={`http://localhost:8000/storage/${bahan.gambar}`} 
                                  alt={bahan.nama}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <ImageIcon className="w-8 h-8 text-gray-300" />
                              )}
                            </div>
                            <div className="w-full p-2 text-center border-t border-gray-100 bg-white/50">
                              <span className={`text-[11px] leading-tight font-medium line-clamp-2 ${isSelected ? "text-emerald-700" : "text-gray-700"}`}>
                                {bahan.nama}
                              </span>
                            </div>
                          </button>
                        )
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right Column ── */}
            <div className="space-y-5">
              {/* Kategori */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Kategori</Label>
                <Select value={kategoriId} onValueChange={setKategoriId}>
                  <SelectTrigger className="rounded-lg border-gray-300">
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {kategoriOptions.map((k) => (
                      <SelectItem key={k.id} value={k.id}>{k.nama}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Selected Bahan Baku List */}
              <div className="space-y-2">
                <div className="border border-gray-200 rounded-lg p-3 min-h-[200px] max-h-[260px] overflow-y-auto space-y-3">
                  {bahanBaku.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-8">Pilih bahan baku dari daftar di sebelah kiri untuk menyusun resep menu ini</p>
                  )}
                  {bahanBaku.map((item) => (
                    <div key={item.bahan_master_id} className="flex items-center gap-3">
                      <div className="flex-1">
                        <Label className="text-xs text-gray-500 mb-1 block">Bahan Baku</Label>
                        <div className="flex items-center gap-1.5">
                          <Input value={item.nama} readOnly className="rounded-lg border-gray-300 bg-gray-50 text-sm h-9" />
                          <button type="button" onClick={() => removeBahanBakuItem(item.bahan_master_id)} className="text-gray-400 hover:text-red-500 transition-colors shrink-0">
                            <X className="size-4" />
                          </button>
                        </div>
                      </div>
                      <div className="w-24">
                        <Label className="text-xs text-gray-500 mb-1 block">Jml ({item.satuan || 'pcs'})</Label>
                        <Input
                          type="number"
                          min={0.01}
                          step={0.01}
                          value={item.jumlah}
                          onChange={(e) => updateJumlah(item.bahan_master_id, Number(e.target.value))}
                          className="rounded-lg border-gray-300 text-sm h-9"
                          required
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Template Harga */}
              <div className="space-y-2">
                <Label htmlFor="harga" className="text-sm font-semibold text-gray-700">Harga Jual Default (Rp)</Label>
                <Input
                  id="harga"
                  type="number"
                  placeholder="15000"
                  value={harga}
                  onChange={(e) => setHarga(e.target.value)}
                  className="rounded-lg border-gray-300"
                  required
                />
              </div>

              {/* Keterangan */}
              <div className="space-y-2">
                <Label htmlFor="keterangan" className="text-sm font-semibold text-gray-700">Keterangan (Opsional)</Label>
                <Input
                  id="keterangan"
                  placeholder="Deskripsi singkat menu ini..."
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  className="rounded-lg border-gray-300"
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
                onClick={handleDelete}
                disabled={isPending}
                className="rounded-full px-8 bg-red-600 hover:bg-red-700 text-white font-semibold"
              >
                {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Hapus"}
              </Button>
            )}
            <Button type="submit" disabled={isPending} className="rounded-full px-8 bg-[#1D5E84] hover:bg-[#154663] text-white font-semibold">
              {(addMutation.isPending || updateMutation.isPending) ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
