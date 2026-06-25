"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, ChevronsUpDown, Loader2, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { MenuFormDialog } from "@/components/owner/menu/menu-form-dialog"
import { useMenu, useDeleteMenu } from "@/hooks/owner/use-menu"
import { MenuMaster } from "@/types/owner/menu"
import { useDebounce } from "@/hooks/use-debounce"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

type SortKey = "id" | "harga"
type SortDir = "asc" | "desc"

interface MenuTableProps {
  search: string
  selectedCategoryId: string
}

export function MenuTable({ search, selectedCategoryId }: MenuTableProps) {
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState<SortKey>("id")
  const [sortDir, setSortDir] = useState<SortDir>("asc")
  const [editItem, setEditItem] = useState<MenuMaster | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<MenuMaster | null>(null)

  const debouncedSearch = useDebounce(search, 1000)
  const { mutate: deleteMenu } = useDeleteMenu()

  // Ambil data menu dari backend
  const { data: menuResponse, isLoading: isLoadingMenu } = useMenu(page, debouncedSearch, selectedCategoryId)
  
  const menuList = menuResponse?.data || []
  const meta = menuResponse?.meta

  // Sorting manual di frontend (Hanya untuk data di halaman ini)
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

  return (
    <>
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
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => setEditItem(row)} 
                        className="flex items-center justify-center size-7 bg-[#3874BC] hover:bg-[#2c5b96] text-white rounded-md transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button 
                        onClick={() => setDeleteTarget(row)} 
                        className="flex items-center justify-center size-7 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {meta && meta.total > 0 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-gray-500">
            Menampilkan Halaman <span className="font-medium text-gray-900">{meta.current_page}</span> dari <span className="font-medium text-gray-900">{meta.last_page}</span> halaman
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
                    "size-8 rounded-full text-xs font-medium transition-colors cursor-pointer",
                    page === pageNum
                      ? "bg-[#1D5E84] hover:bg-[#154663] text-white"
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
              className="h-8 rounded-full px-4 text-xs font-medium cursor-pointer"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Dialog Edit */}
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
          addons: editItem.addons?.map(a => ({
            id: a.id,
            nama: a.nama,
            harga: Number(a.harga)
          })) || [],
          gambarUrl: editItem.gambar ? (editItem.gambar.startsWith('http') ? editItem.gambar : `http://localhost:8000/storage/${editItem.gambar}`) : undefined,
        } : undefined}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
        title="Hapus Menu"
        description={`Apakah Anda yakin ingin menghapus menu "${deleteTarget?.nama}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Ya, Hapus"
        cancelLabel="Batal"
        variant="danger"
        onConfirm={() => {
          if (deleteTarget) deleteMenu(deleteTarget.id)
          setDeleteTarget(null)
        }}
      />
    </>
  )
}
