"use client"

import { useState, useEffect } from "react"
import { Settings, Bell, Search, ChevronDown, ChevronUp, ChevronsUpDown, Plus, Loader2 } from "lucide-react"
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
import { useMenu } from "@/hooks/use-menu"
import { useKategori } from "@/hooks/use-kategori"
import { MenuMaster } from "@/types/menu"
import { useDebounce } from "@/hooks/use-debounce"

type SortKey = "id" | "harga"
type SortDir = "asc" | "desc"

export default function KelolaMenuPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("id")
  const [sortDir, setSortDir] = useState<SortDir>("asc")
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua Kategori")
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("")
  const [tambahOpen, setTambahOpen] = useState(false)
  const [editItem, setEditItem] = useState<MenuMaster | null>(null)

  const debouncedSearch = useDebounce(search, 1000)

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, selectedCategoryId])

  // Ambil data menu dan kategori dari backend
  const { data: menuResponse, isLoading: isLoadingMenu } = useMenu(page, debouncedSearch, selectedCategoryId)
  const { data: kategoriResponse } = useKategori(1, "", 1000)

  const menuList = menuResponse?.data || []
  const meta = menuResponse?.meta
  const categories = kategoriResponse?.data || []

  // Karena endpoint saat ini belum mendukung sort parameter dari frontend,
  // kita tetap bisa melakukan sorting manual di frontend HANYA UNTUK DATA DI HALAMAN INI.
  // Idealnya ini dikirim ke backend.
  const sorted = [...menuList].sort((a, b) => {
    let av: any = a.nama
    let bv: any = b.nama
    if (sortKey === "harga") {
      av = Number(a.harga_default)
      bv = Number(b.harga_default)
    }
    
    if (av < bv) return sortDir === "asc" ? -1 : 1
    if (av > bv) return sortDir === "asc" ? 1 : -1
    return 0
  })

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((p) => (p === "asc" ? "desc" : "asc"))
    else { setSortKey(key); setSortDir("asc") }
  }

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronsUpDown className="w-3 h-3 ml-1 opacity-40" />
    return sortDir === "asc" ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />
  }

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: "id", label: "Nama" },
    { key: "harga", label: "Harga" },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/40">
      {/* Top Bar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-6 shadow-sm">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><span className="text-sm text-muted-foreground">KELOLA</span></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage className="text-sm">Menu</BreadcrumbPage></BreadcrumbItem>
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
            <p className="text-sm text-gray-500 mt-0.5">Informasi detail menu dan resep</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Categories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1.5 text-sm border-gray-200 text-gray-700 h-9 rounded-full px-4 cursor-pointer">
                  {selectedCategory === "Semua Kategori" ? "Kategori" : selectedCategory} <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 max-h-[300px] overflow-y-auto">
                <DropdownMenuItem 
                  onClick={() => { setSelectedCategory("Semua Kategori"); setSelectedCategoryId(""); setPage(1); }} 
                  className={cn("cursor-pointer", selectedCategory === "Semua Kategori" && "font-medium text-blue-600")}
                >
                  Semua Kategori
                </DropdownMenuItem>
                {categories.map((cat) => (
                  <DropdownMenuItem 
                    key={cat.id} 
                    onClick={() => { setSelectedCategory(cat.nama); setSelectedCategoryId(cat.id); setPage(1); }} 
                    className={cn("cursor-pointer", selectedCategory === cat.nama && "font-medium text-blue-600")}
                  >
                    {cat.nama}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="relative">
              <Input 
                placeholder="Search" 
                value={search} 
                onChange={(e) => { setSearch(e.target.value); setPage(1); }} 
                className="pr-9 h-9 w-44 text-sm border-gray-200 rounded-full bg-white" 
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <Button onClick={() => setTambahOpen(true)} className="h-9 rounded-lg bg-[#1D5E84] hover:bg-[#154663] text-white gap-1.5 px-4 text-sm cursor-pointer">
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
                  { key: "id", label: "No", className: "w-16 text-center" },
                  { key: "nama", label: "Nama Menu", className: "" },
                  { key: "kategori", label: "Kategori", className: "" },
                  { key: "jumlahBahanBaku", label: "Jumlah Bahan Baku", className: "text-center" },
                  { key: "harga", label: "Harga", className: "" },
                ].map((col) => {
                  const isSortable = col.key === "id" || col.key === "harga"
                  return (
                    <TableHead 
                      key={col.key} 
                      className={cn(col.className, isSortable && "cursor-pointer select-none")}
                      onClick={isSortable ? () => handleSort(col.key as SortKey) : undefined}
                    >
                      <div className={cn("flex items-center text-gray-600 font-semibold text-sm", (col.key === "id" || col.key === "jumlahBahanBaku") && "justify-center")}>
                        {col.label}
                        {isSortable && <SortIcon col={col.key as SortKey} />}
                      </div>
                    </TableHead>
                  )
                })}
                <TableHead className="w-28 text-center text-gray-600 font-semibold text-sm">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingMenu ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <Loader2 className="size-6 animate-spin text-blue-600 mx-auto" />
                  </TableCell>
                </TableRow>
              ) : sorted.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-400 py-12 text-sm">Tidak ada data ditemukan.</TableCell>
                </TableRow>
              ) : (
                sorted.map((row, index) => (
                  <TableRow key={row.id} className="hover:bg-gray-50/50 border-gray-100 transition-colors">
                    <TableCell className="text-gray-500 text-sm text-center">
                       {sortKey === "id" && sortDir === "desc" 
                         ? (meta ? meta.total - ((meta.current_page - 1) * meta.per_page) - index : sorted.length - index)
                         : (meta ? (meta.current_page - 1) * meta.per_page + index + 1 : index + 1)}
                    </TableCell>
                    <TableCell className="text-gray-800 text-sm font-medium">{row.nama}</TableCell>
                    <TableCell className="text-gray-600 text-sm">{row.kategori?.nama || '-'}</TableCell>
                    <TableCell className="text-gray-600 text-sm text-center">{row.bahan_masters?.length || 0}</TableCell>
                    <TableCell className="text-gray-600 text-sm">Rp {Number(row.harga_default).toLocaleString("id-ID")}</TableCell>
                    <TableCell className="text-center">
                      <button onClick={() => setEditItem(row)} className="bg-green-100 hover:bg-green-200 text-green-700 text-xs font-bold h-7 px-5 rounded-full transition-colors cursor-pointer">
                        EDIT
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        {meta && meta.total > 0 && (
          <div className="flex items-center justify-between pt-2 cursor-pointer">
            <p className="text-sm text-gray-500">
              Menampilkan <span className="font-medium text-gray-900">{meta.from || 0}</span> hingga <span className="font-medium text-gray-900">{meta.to || 0}</span> dari <span className="font-medium text-gray-900">{meta.total}</span> data
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-8 rounded-full px-4 text-xs font-medium"
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={cn(
                      "size-8 rounded-full text-xs font-medium transition-colors",
                      page === pageNum
                        ? "bg-orange-500 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
                disabled={page === meta.last_page}
                className="h-8 rounded-full px-4 text-xs font-medium"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Dialogs */}
      <MenuFormDialog open={tambahOpen} onOpenChange={setTambahOpen} mode="tambah" />
      <MenuFormDialog
        open={!!editItem}
        onOpenChange={(open) => { if (!open) setEditItem(null) }}
        mode="edit"
        initialData={editItem ? {
          id: editItem.id,
          namaMenu: editItem.nama,
          kategori_id: editItem.kategori_id,
          harga: Number(editItem.harga_default),
          keterangan: editItem.keterangan || "",
          bahanBaku: editItem.bahan_masters?.map(b => ({
            bahan_master_id: b.pivot.bahan_master_id,
            nama: b.nama,
            jumlah: Number(b.pivot.jumlah_pakai),
            satuan: b.satuan
          })) || [],
          gambarUrl: editItem.gambar ? `http://localhost:8000/storage/${editItem.gambar}` : undefined,
        } : undefined}
      />
    </div>
  )
}
