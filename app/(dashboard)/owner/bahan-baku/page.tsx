"use client"

import { useState, useMemo, useEffect } from "react"
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
import { BahanBakuFormDialog } from "@/components/bahan-baku/bahan-baku-form-dialog"
import { useBahanBaku } from "@/hooks/use-bahan-baku"
import { BahanMaster } from "@/types/bahan-baku"
import { useDebounce } from "@/hooks/use-debounce"

type SortKey = "id" | "nama" | "satuan" | "harga_default"
type SortDir = "asc" | "desc"

export default function KelolaBahanBakuPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("id")
  const [sortDir, setSortDir] = useState<SortDir>("asc")
  const [tambahOpen, setTambahOpen] = useState(false)
  const [editItem, setEditItem] = useState<BahanMaster | null>(null)

  const debouncedSearch = useDebounce(search, 1000)

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  const { data: paginatedResponse, isLoading, isError } = useBahanBaku(page, debouncedSearch)
  const bahanBakuList = paginatedResponse?.data || []
  const meta = paginatedResponse?.meta

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((p) => (p === "asc" ? "desc" : "asc"))
    else { setSortKey(key); setSortDir("asc") }
  }

  // Frontend sorting for the current page
  const sorted = useMemo(() => {
    return [...bahanBakuList].sort((a, b) => {
      let av: string | number = a[sortKey]; 
      let bv: string | number = b[sortKey];
      if (sortKey === "harga_default") {
        av = parseFloat(av as string)
        bv = parseFloat(bv as string)
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1
      if (av > bv) return sortDir === "asc" ? 1 : -1
      return 0
    })
  }, [bahanBakuList, sortKey, sortDir])

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronsUpDown className="w-3 h-3 ml-1 opacity-40" />
    return sortDir === "asc" ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />
  }

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: "id", label: "No" },
    { key: "harga_default", label: "Harga Default" },
  ]

  const formatRupiah = (angka: string) => {
    const number = parseFloat(angka)
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number)
  }

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
            <BreadcrumbItem><BreadcrumbPage className="text-sm">Kelola Bahan Baku</BreadcrumbPage></BreadcrumbItem>
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
            <h2 className="text-2xl font-bold text-gray-800">Kelola Bahan Baku</h2>
            <p className="text-sm text-gray-500 mt-0.5">Informasi detail bahan baku</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} className="pr-9 h-9 w-44 text-sm border-gray-200 rounded-full" />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <Button onClick={() => setTambahOpen(true)} className="h-9 rounded-lg bg-[#1D5E84] hover:bg-[#154663] text-white gap-1.5 px-4 text-sm cursor-pointer">
              <Plus className="size-4" /> Tambah Bahan Baku
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
                  { key: "nama" as SortKey, label: "Nama Bahan Baku", className: "" },
                  { key: "satuan" as SortKey, label: "Satuan", className: "" },
                  { key: "harga_default" as SortKey, label: "Harga Default", className: "" },
                ].map((col) => {
                  const isSortable = col.key === "id" || col.key === "harga_default"
                  return (
                    <TableHead 
                      key={col.key} 
                      className={cn(col.className, isSortable && "cursor-pointer select-none")} 
                      onClick={isSortable ? () => handleSort(col.key) : undefined}
                    >
                      <div className={cn("flex items-center text-gray-600 font-semibold text-sm", col.key === "id" && "justify-center")}>
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
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-400 py-12 text-sm">Loading data...</TableCell>
                </TableRow>
              )}
              {isError && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-red-500 py-12 text-sm">Gagal mengambil data dari server.</TableCell>
                </TableRow>
              )}
              {!isLoading && !isError && sorted.map((row, index) => (
                <TableRow key={row.id} className="hover:bg-gray-50/50 border-gray-100 transition-colors">
                  <TableCell className="text-gray-500 text-sm text-center">
                    {sortKey === "id" && sortDir === "desc" 
                      ? (meta ? meta.total - ((meta.current_page - 1) * meta.per_page) - index : sorted.length - index)
                      : (meta ? (meta.current_page - 1) * meta.per_page + index + 1 : index + 1)}
                  </TableCell>
                  <TableCell className="text-gray-800 text-sm">{row.nama}</TableCell>
                  <TableCell className="text-gray-600 text-sm">{row.satuan}</TableCell>
                  <TableCell className="text-gray-600 text-sm">{formatRupiah(row.harga_default)}</TableCell>
                  <TableCell className="text-center">
                    <button onClick={() => setEditItem(row)} className="bg-green-100 hover:bg-green-200 text-green-700 text-xs font-bold h-7 px-5 rounded-full transition-colors">
                      EDIT
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              {!isLoading && !isError && sorted.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-400 py-12 text-sm">Tidak ada data ditemukan.</TableCell>
                </TableRow>
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
                className="h-8 rounded-full px-4 text-xs font-medium cursor-pointer"
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
                        : "text-gray-600 hover:bg-gray-100 cursor-pointer"
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
                className="h-8 rounded-full px-4 text-xs font-medium cursor-pointer"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Dialogs */}
      <BahanBakuFormDialog open={tambahOpen} onOpenChange={setTambahOpen} mode="tambah" />
      <BahanBakuFormDialog
        open={!!editItem}
        onOpenChange={(open) => { if (!open) setEditItem(null) }}
        mode="edit"
        initialData={editItem ? { 
          id: editItem.id, 
          namaBahanBaku: editItem.nama, 
          satuan: editItem.satuan, 
          hargaDefault: parseFloat(editItem.harga_default),
          gambarUrl: editItem.gambar ? `http://localhost:8000/storage/${editItem.gambar}` : undefined
        } : undefined}
      />
    </div>
  )
}
