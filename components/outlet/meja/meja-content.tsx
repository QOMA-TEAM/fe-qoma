"use client"

import { useState } from "react"
import { Search, Loader2, Plus, Pencil, Trash2, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useMejaList } from "@/hooks/outlet/use-meja"
import { useDebounce } from "@/hooks/use-debounce"
import { CreateMejaDialog } from "./create-meja-dialog"
import { EditMejaDialog } from "./edit-meja-dialog"
import { DeleteMejaDialog } from "./delete-meja-dialog"
import { ViewQrDialog } from "./view-qr-dialog"
import type { Meja } from "@/services/outlet/meja-service"

export function MejaContent() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  // Dialog States
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [mejaForEdit, setMejaForEdit] = useState<Meja | null>(null)
  const [mejaForDelete, setMejaForDelete] = useState<Meja | null>(null)
  const [mejaForQr, setMejaForQr] = useState<Meja | null>(null)

  const debouncedSearch = useDebounce(search, 800)

  // Fetch Data
  const { data: response, isLoading, isError } = useMejaList(page, debouncedSearch)
  const items = response?.data || []
  const meta = response?.meta

  return (
    <div className="p-6 space-y-6 bg-transparent">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kelola Meja</h1>
          <p className="text-sm text-gray-500 mt-0.5">Informasi detail meja dan QR Code</p>
        </div>

        {/* Tambah Meja Button positioned on the right using color #FB6300 */}

      </div>


      <div className="flex flex-col gap-4">
        {/* Search Control */}
        <div className="flex items-center gap-2 flex-wrap sm:justify-between pt-2">
          <div className="relative">
            <Input
              placeholder="Cari meja..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="pr-9 h-9 w-52 text-sm border-gray-200 rounded-full bg-white"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <div className="flex justify-end sm:block">
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-5 h-10 rounded-md shadow-sm flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Plus className="size-4" />
              Tambah Meja
            </Button>
          </div>
        </div>

        {/* Tables list */}
        <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-gray-200">
                <TableHead className="w-16 text-center text-gray-600 font-semibold text-sm">No</TableHead>
                <TableHead className="text-gray-600 font-semibold text-sm">Nomor Meja</TableHead>
                <TableHead className="w-32 text-center text-gray-600 font-semibold text-sm">Status</TableHead>
                <TableHead className="w-40 text-center text-gray-600 font-semibold text-sm">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={4} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                      <p className="text-sm text-gray-500">Memuat data meja...</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {isError && (
                <TableRow>
                  <TableCell colSpan={4} className="h-64 text-center">
                    <div className="text-red-500 font-medium">Gagal mengambil data meja dari server.</div>
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && !isError && items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-64 text-center text-gray-500">
                    Tidak ada data meja ditemukan.
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                !isError &&
                items.map((row, index) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-blue-50/30 transition-colors border-b border-gray-100"
                  >
                    <TableCell className="text-center py-4 text-gray-600">
                      {meta ? (meta.current_page - 1) * meta.per_page + index + 1 : index + 1}
                    </TableCell>

                    <TableCell className="py-4 text-gray-800 text-sm font-semibold">
                      {row.nomor_meja}
                    </TableCell>

                    <TableCell className="text-center py-4">
                      {row.status === "Tersedia" ? (
                        <Badge className="bg-green-50 text-green-700 hover:bg-green-50 border border-green-200 font-medium rounded-full">
                          Tersedia
                        </Badge>
                      ) : row.status === "Terisi" ? (
                        <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50 border border-amber-200 font-medium rounded-full">
                          Terisi
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-50 text-gray-600 hover:bg-gray-50 border border-gray-200 font-medium rounded-full">
                          {row.status}
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="text-center py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* View QR Code */}
                        <button
                          onClick={() => setMejaForQr(row)}
                          className="flex items-center justify-center size-7 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md transition-colors cursor-pointer border border-blue-200 shadow-sm"
                          title="Tampilkan QR Code"
                        >
                          <QrCode className="size-4" />
                        </button>
                        {/* Edit Meja */}
                        <button
                          onClick={() => setMejaForEdit(row)}
                          className="flex items-center justify-center size-7 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-md transition-colors cursor-pointer border border-gray-200 shadow-sm"
                          title="Edit Meja"
                        >
                          <Pencil className="size-4" />
                        </button>
                        {/* Delete Meja */}
                        <button
                          onClick={() => setMejaForDelete(row)}
                          className="flex items-center justify-center size-7 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-colors cursor-pointer border border-red-100 shadow-sm"
                          title="Hapus Meja"
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
          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-gray-500">
              Menampilkan Halaman <span className="font-medium text-gray-900">{meta.current_page}</span> dari{" "}
              <span className="font-medium text-gray-900">{meta.last_page}</span> halaman
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-8 rounded-full px-4 text-xs font-medium cursor-pointer"
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((pageNum) => {
                  if (
                    pageNum === 1 ||
                    pageNum === meta.last_page ||
                    (pageNum >= page - 1 && pageNum <= page + 1)
                  ) {
                    return (
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
                    )
                  }
                  if (pageNum === page - 2 || pageNum === page + 2) {
                    return <span key={pageNum} className="text-gray-400 px-1">...</span>
                  }
                  return null
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                disabled={page === meta.last_page}
                className="h-8 rounded-full px-4 text-xs font-medium cursor-pointer"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <CreateMejaDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <EditMejaDialog
        meja={mejaForEdit}
        onClose={() => setMejaForEdit(null)}
      />

      <DeleteMejaDialog
        meja={mejaForDelete}
        onClose={() => setMejaForDelete(null)}
      />

      <ViewQrDialog
        meja={mejaForQr}
        onClose={() => setMejaForQr(null)}
      />
    </div>
  )
}
