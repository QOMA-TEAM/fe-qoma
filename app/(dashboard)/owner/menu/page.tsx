"use client"

import { useState, useMemo } from "react"
import { Settings, Bell, Search, ChevronDown, ChevronUp, ChevronsUpDown, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { cn } from "@/lib/utils"
import { MenuFormDialog } from "@/components/menu/menu-form-dialog"

// ── Types & Dummy Data ──
export type MenuItem = {
  id: number
  namaMenu: string
  kategori: string
  jumlahBahanBaku: number
  harga: number
  bahanBaku: { nama: string; jumlah: number }[]
}

const menuList: MenuItem[] = [
  { id: 1, namaMenu: "Nasi Goreng", kategori: "Nasi & Mie", jumlahBahanBaku: 10, harga: 15000, bahanBaku: [{ nama: "Bawang Putih", jumlah: 2 }, { nama: "Bawang Merah", jumlah: 3 }, { nama: "Cabai Merah", jumlah: 2 }, { nama: "Wortel", jumlah: 1 }, { nama: "Kacang Panjang", jumlah: 2 }] },
  { id: 2, namaMenu: "Mie Goreng", kategori: "Nasi & Mie", jumlahBahanBaku: 15, harga: 12000, bahanBaku: [{ nama: "Bawang Putih", jumlah: 2 }, { nama: "Cabai Merah", jumlah: 1 }, { nama: "Wortel", jumlah: 2 }] },
  { id: 3, namaMenu: "Sate Ayam", kategori: "Lauk Pauk", jumlahBahanBaku: 10, harga: 25000, bahanBaku: [{ nama: "Bawang Merah", jumlah: 3 }, { nama: "Kunyit", jumlah: 1 }, { nama: "Lengkuas", jumlah: 1 }] },
  { id: 4, namaMenu: "Rendang Daging", kategori: "Lauk Pauk", jumlahBahanBaku: 8, harga: 30000, bahanBaku: [{ nama: "Bawang Merah", jumlah: 4 }, { nama: "Cabai Merah", jumlah: 5 }, { nama: "Jahe", jumlah: 2 }] },
  { id: 5, namaMenu: "Gado-Gado", kategori: "Sayuran", jumlahBahanBaku: 12, harga: 18000, bahanBaku: [{ nama: "Kentang", jumlah: 2 }, { nama: "Bayam", jumlah: 3 }, { nama: "Timun", jumlah: 2 }] },
  { id: 6, namaMenu: "Bakso", kategori: "Sup & Soto", jumlahBahanBaku: 20, harga: 20000, bahanBaku: [{ nama: "Bawang Putih", jumlah: 3 }, { nama: "Daun Salam", jumlah: 2 }] },
  { id: 7, namaMenu: "Soto Ayam", kategori: "Sup & Soto", jumlahBahanBaku: 15, harga: 22000, bahanBaku: [{ nama: "Kunyit", jumlah: 2 }, { nama: "Jahe", jumlah: 1 }, { nama: "Daun Salam", jumlah: 1 }] },
  { id: 8, namaMenu: "Nasi Uduk", kategori: "Nasi & Mie", jumlahBahanBaku: 10, harga: 14000, bahanBaku: [{ nama: "Bawang Merah", jumlah: 2 }, { nama: "Daun Salam", jumlah: 1 }] },
  { id: 9, namaMenu: "Ayam Penyet", kategori: "Lauk Pauk", jumlahBahanBaku: 12, harga: 28000, bahanBaku: [{ nama: "Cabai Merah", jumlah: 5 }, { nama: "Bawang Putih", jumlah: 2 }, { nama: "Tomat", jumlah: 2 }] },
  { id: 10, namaMenu: "Tahu Tempe", kategori: "Gorengan", jumlahBahanBaku: 20, harga: 8000, bahanBaku: [{ nama: "Bawang Putih", jumlah: 1 }] },
  { id: 11, namaMenu: "Kerupuk", kategori: "Makanan Ringan", jumlahBahanBaku: 25, harga: 5000, bahanBaku: [{ nama: "Bawang Putih", jumlah: 1 }] },
  { id: 12, namaMenu: "Lumpia", kategori: "Gorengan", jumlahBahanBaku: 15, harga: 11000, bahanBaku: [{ nama: "Wortel", jumlah: 2 }, { nama: "Bawang Putih", jumlah: 1 }] },
  { id: 13, namaMenu: "Sop Buntut", kategori: "Sup & Soto", jumlahBahanBaku: 6, harga: 35000, bahanBaku: [{ nama: "Wortel", jumlah: 2 }, { nama: "Kentang", jumlah: 2 }] },
  { id: 14, namaMenu: "Pizza Tempe", kategori: "Makanan Berat", jumlahBahanBaku: 8, harga: 40000, bahanBaku: [{ nama: "Tomat", jumlah: 3 }, { nama: "Paprika", jumlah: 2 }] },
  { id: 15, namaMenu: "Kwetiau Goreng", kategori: "Nasi & Mie", jumlahBahanBaku: 12, harga: 20000, bahanBaku: [{ nama: "Bawang Putih", jumlah: 2 }, { nama: "Wortel", jumlah: 1 }] },
  { id: 16, namaMenu: "Es Teh Manis", kategori: "Minuman Dingin", jumlahBahanBaku: 30, harga: 5000, bahanBaku: [] },
  { id: 17, namaMenu: "Es Jeruk", kategori: "Minuman Dingin", jumlahBahanBaku: 30, harga: 7000, bahanBaku: [] },
  { id: 18, namaMenu: "Klepon", kategori: "Dessert", jumlahBahanBaku: 20, harga: 10000, bahanBaku: [] },
  { id: 19, namaMenu: "Bubur Ayam", kategori: "Makanan Berat", jumlahBahanBaku: 10, harga: 15000, bahanBaku: [{ nama: "Bawang Merah", jumlah: 2 }, { nama: "Jahe", jumlah: 1 }] },
  { id: 20, namaMenu: "Es Campur", kategori: "Minuman Dingin", jumlahBahanBaku: 5, harga: 12000, bahanBaku: [] },
]

type SortKey = "id" | "namaMenu" | "jumlahBahanBaku" | "harga"
type SortDir = "asc" | "desc"

export default function KelolaMenuPage() {
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("id")
  const [sortDir, setSortDir] = useState<SortDir>("asc")
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua Kategori")
  const [tambahOpen, setTambahOpen] = useState(false)
  const [editItem, setEditItem] = useState<MenuItem | null>(null)

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((p) => (p === "asc" ? "desc" : "asc"))
    else { setSortKey(key); setSortDir("asc") }
  }

  const categories = useMemo(() => {
    const cats = Array.from(new Set(menuList.map(m => m.kategori)))
    return ["Semua Kategori", ...cats]
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return menuList.filter((m) => {
      const matchSearch = m.namaMenu.toLowerCase().includes(q) || m.kategori.toLowerCase().includes(q)
      const matchCategory = selectedCategory === "Semua Kategori" || m.kategori === selectedCategory
      return matchSearch && matchCategory
    })
  }, [search, selectedCategory])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sortKey]; const bv = b[sortKey]
      if (av < bv) return sortDir === "asc" ? -1 : 1
      if (av > bv) return sortDir === "asc" ? 1 : -1
      return 0
    })
  }, [filtered, sortKey, sortDir])

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronsUpDown className="w-3 h-3 ml-1 opacity-40" />
    return sortDir === "asc" ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />
  }

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: "id", label: "No" },
    { key: "harga", label: "Harga" },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/40">
      {/* Top Bar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-6 shadow-sm">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="/owner/dashboard" className="text-sm text-muted-foreground">QOMA</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><span className="text-sm text-muted-foreground">KELOLA</span></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage className="text-sm">Kelola Menu</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-3">
          <button type="button" className="flex items-center justify-center size-9 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors" aria-label="Settings"><Settings className="size-4" /></button>
          <button type="button" className="relative flex items-center justify-center size-9 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors" aria-label="Notifications">
            <Bell className="size-4" />
            <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-orange-500 ring-2 ring-white" />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto p-6 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Kelola Menu</h2>
            <p className="text-sm text-gray-500 mt-0.5">Informasi detail bahan baku</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Categories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1.5 text-sm border-gray-200 text-gray-700 h-9 rounded-full px-4">
                  {selectedCategory === "Semua Kategori" ? "Categories" : selectedCategory} <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 max-h-[300px] overflow-y-auto">
                {categories.map((cat) => (
                  <DropdownMenuItem key={cat} onClick={() => setSelectedCategory(cat)} className={cn("cursor-pointer", selectedCategory === cat && "font-medium text-blue-600")}>
                    {cat}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sort By Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1.5 text-sm border-gray-200 text-gray-700 h-9 rounded-full px-4">
                  Sort By <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {sortOptions.map((item) => (
                  <DropdownMenuItem key={item.key} onClick={() => handleSort(item.key)} className={cn("cursor-pointer", sortKey === item.key && "font-medium text-blue-600")}>
                    {item.label}
                    {sortKey === item.key && <span className="ml-auto text-xs text-gray-400">{sortDir === "asc" ? "↑" : "↓"}</span>}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="relative">
              <Input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} className="pr-9 h-9 w-44 text-sm border-gray-200 rounded-full" />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <Button onClick={() => setTambahOpen(true)} className="h-9 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white gap-1.5 px-4 text-sm">
              <Plus className="size-4" /> Tambah Menu
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-gray-200">
                {[
                  { key: "id" as SortKey, label: "No", className: "w-16 text-center" },
                  { key: "namaMenu" as SortKey, label: "Nama Menu", className: "" },
                  { key: "jumlahBahanBaku" as SortKey, label: "Jumlah Bahan Baku", className: "text-center" },
                  { key: "harga" as SortKey, label: "Harga", className: "" },
                ].map((col) => {
                  const isSortable = col.key === "id" || col.key === "harga"
                  return (
                    <TableHead 
                      key={col.key} 
                      className={cn(col.className, isSortable && "cursor-pointer select-none")}
                      onClick={isSortable ? () => handleSort(col.key) : undefined}
                    >
                      <div className={cn("flex items-center text-gray-600 font-semibold text-sm", (col.key === "id" || col.key === "jumlahBahanBaku") && "justify-center")}>
                        {col.label}
                        {isSortable && <SortIcon col={col.key} />}
                      </div>
                    </TableHead>
                  )
                })}
                <TableHead className="w-28 text-center text-gray-600 font-semibold text-sm">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((row) => (
                <TableRow key={row.id} className="hover:bg-gray-50/50 border-gray-100 transition-colors">
                  <TableCell className="text-gray-500 text-sm text-center">{row.id}</TableCell>
                  <TableCell className="text-gray-800 text-sm">{row.namaMenu}</TableCell>
                  <TableCell className="text-gray-600 text-sm text-center">{row.jumlahBahanBaku}</TableCell>
                  <TableCell className="text-gray-600 text-sm">Rp {row.harga.toLocaleString("id-ID")}</TableCell>
                  <TableCell className="text-center">
                    <button onClick={() => setEditItem(row)} className="bg-green-100 hover:bg-green-200 text-green-700 text-xs font-bold h-7 px-5 rounded-full transition-colors">
                      EDIT
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              {sorted.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-400 py-12 text-sm">Tidak ada data ditemukan.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>

      {/* Dialogs */}
      <MenuFormDialog open={tambahOpen} onOpenChange={setTambahOpen} mode="tambah" />
      <MenuFormDialog
        open={!!editItem}
        onOpenChange={(open) => { if (!open) setEditItem(null) }}
        mode="edit"
        initialData={editItem ? {
          namaMenu: editItem.namaMenu,
          kategori: editItem.kategori,
          harga: editItem.harga,
          bahanBaku: editItem.bahanBaku,
        } : undefined}
      />
    </div>
  )
}
