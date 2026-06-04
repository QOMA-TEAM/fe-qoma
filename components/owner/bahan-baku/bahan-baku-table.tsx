"use client"

import { useState, useMemo, useEffect } from "react"
import { ChevronDown, ChevronUp, ChevronsUpDown, Loader2, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { BahanBakuFormDialog } from "@/components/owner/bahan-baku/bahan-baku-form-dialog"
import { useBahanBaku, useDeleteBahanBaku } from "@/hooks/owner/use-bahan-baku"
import { BahanMaster } from "@/types/owner/bahan-baku"
import { useDebounce } from "@/hooks/use-debounce"

type SortKey = "id" | "nama" | "satuan" | "harga_default"
type SortDir = "asc" | "desc"

interface BahanBakuTableProps {
  search: string
}

export function BahanBakuTable({ search }: BahanBakuTableProps) {
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState<SortKey>("id")
  const [sortDir, setSortDir] = useState<SortDir>("asc")
  const [editItem, setEditItem] = useState<BahanMaster | null>(null)

  const debouncedSearch = useDebounce(search, 1000)
  const { mutate: deleteBahan } = useDeleteBahanBaku()

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
    <>
      <div className="rounded-xl border border-gray-200 overflow-hidden bg-white mt-4">
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
                <TableCell colSpan={5} className="text-center text-gray-400 py-12 text-sm">
                  <Loader2 className="size-6 animate-spin text-blue-600 mx-auto" />
                </TableCell>
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
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => setEditItem(row)} 
                      className="flex items-center justify-center size-7 bg-[#3874BC] hover:bg-[#2c5b96] text-white rounded-md transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button 
                      onClick={() => {
                        if (window.confirm("Apakah Anda yakin ingin menghapus bahan baku ini?")) {
                          deleteBahan(row.id)
                        }
                      }} 
                      className="flex items-center justify-center size-7 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors cursor-pointer"
                      title="Hapus"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
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
                    "size-8 rounded-full text-xs font-medium transition-colors",
                    page === pageNum
                      ? "bg-[#1D5E84] hover:bg-[#154663] text-white"
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

      {/* Dialog Edit */}
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
    </>
  )
}
