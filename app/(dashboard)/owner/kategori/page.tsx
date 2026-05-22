"use client"

import { useState, useMemo, useEffect } from "react"
import { Settings, Bell, Search, ChevronDown, ChevronUp, ChevronsUpDown, Plus, Loader2, Pencil, Trash2 } from "lucide-react"
import { HeaderActions } from "@/components/dashboard/header-actions"
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
import { KategoriFormDialog } from "@/components/kategori/kategori-form-dialog"
import { useKategori, useDeleteKategori } from "@/hooks/use-kategori"
import { KategoriMaster } from "@/types/kategori"
import { useDebounce } from "@/hooks/use-debounce"

type SortKey = "id" | "nama"
type SortDir = "asc" | "desc"

export default function KelolaKategoriPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("id")
  const [sortDir, setSortDir] = useState<SortDir>("asc")
  const [tambahOpen, setTambahOpen] = useState(false)
  const [editItem, setEditItem] = useState<KategoriMaster | null>(null)
  
  const { mutate: deleteKategori } = useDeleteKategori()
  const debouncedSearch = useDebounce(search, 1000)

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  const { data: paginatedResponse, isLoading, isError } = useKategori(page, debouncedSearch)
  const kategoriList = paginatedResponse?.data || []
  const meta = paginatedResponse?.meta

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((p) => (p === "asc" ? "desc" : "asc"))
    else { setSortKey(key); setSortDir("asc") }
  }

  const sorted = useMemo(() => {
    return [...kategoriList].sort((a, b) => {
      const av = a[sortKey]; const bv = b[sortKey]
      if (av < bv) return sortDir === "asc" ? -1 : 1
      if (av > bv) return sortDir === "asc" ? 1 : -1
      return 0
    })
  }, [kategoriList, sortKey, sortDir])

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronsUpDown className="w-3 h-3 ml-1 opacity-40" />
    return sortDir === "asc" ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />
  }

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: "id", label: "No" },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/40">
      {/* Top Bar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-6 shadow-sm">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><span className="text-sm text-muted-foreground">KELOLA</span></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage className="text-sm">Kategori</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <HeaderActions />
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto p-6 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Kelola Kategori</h2>
            <p className="text-sm text-gray-500 mt-0.5">Informasi detail kategori menu</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} className="pr-9 h-9 w-44 text-sm border-gray-200 rounded-full" />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <Button onClick={() => setTambahOpen(true)} className="h-9 rounded-lg bg-[#1D5E84] hover:bg-[#154663] text-white gap-1.5 px-4 text-sm cursor-pointer">
              <Plus className="size-4" /> Tambah Kategori
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
                  { key: "nama" as SortKey, label: "Nama Kategori", className: "" },
                ].map((col) => {
                  const isSortable = col.key === "id"
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
                  <TableCell colSpan={3} className="text-center text-gray-400 py-12 text-sm">
                    <Loader2 className="size-6 animate-spin text-blue-600 mx-auto" />
                  </TableCell>
                </TableRow>
              )}
              {isError && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-red-500 py-12 text-sm">Gagal mengambil data dari server.</TableCell>
                </TableRow>
              )}
              {!isLoading && !isError && sorted.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-gray-400 py-12 text-sm">Tidak ada data ditemukan.</TableCell>
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
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => setEditItem(row)} 
                        className="flex items-center justify-center size-7 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
                            deleteKategori(row.id)
                          }
                        }} 
                        className="flex items-center justify-center size-7 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-colors cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
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
      <KategoriFormDialog open={tambahOpen} onOpenChange={setTambahOpen} mode="tambah" />
      <KategoriFormDialog
        open={!!editItem}
        onOpenChange={(open) => { if (!open) setEditItem(null) }}
        mode="edit"
        initialData={editItem ? { id: editItem.id, nama: editItem.nama } : undefined}
      />
    </div>
  )
}
