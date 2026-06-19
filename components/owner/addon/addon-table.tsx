"use client"

import * as React from "react"
import { PlusCircle, Search, Settings2, MoreHorizontal, Pencil, Trash2, ListPlus } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatRupiah } from "@/lib/utils"
import { Addon } from "@/services/owner/addon"

import { useDeleteAddon } from "@/hooks/owner/use-addon"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useState } from "react"

interface AddonTableProps {
  data: Addon[]
  onEdit: (addon: Addon) => void
  meta?: { current_page: number; last_page: number; per_page: number; total: number }
  page: number
  setPage: (p: number | ((prev: number) => number)) => void
}

export function AddonTable({ data, onEdit, meta, page, setPage }: AddonTableProps) {
  const { mutate: deleteAddon } = useDeleteAddon()
  const [deleteTarget, setDeleteTarget] = useState<Addon | null>(null)
  return (
    <>
      <div className="rounded-xl border border-gray-200 overflow-hidden bg-white mt-4">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-gray-200">
              <TableHead className="w-16 text-center text-gray-600 font-semibold text-sm">No</TableHead>
              <TableHead className="text-gray-600 font-semibold text-sm">Nama Add On</TableHead>
              <TableHead className="text-gray-600 font-semibold text-sm">Harga</TableHead>
              <TableHead className="w-28 text-center text-gray-600 font-semibold text-sm">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-gray-400 text-sm">
                  Tidak ada add on yang ditemukan
                </TableCell>
              </TableRow>
            ) : (
              data.map((addon, index) => (
                <TableRow key={addon.id} className="hover:bg-gray-50/50 border-gray-100 transition-colors">
                  <TableCell className="text-gray-500 text-sm text-center">
                    {meta ? (meta.current_page - 1) * meta.per_page + index + 1 : index + 1}
                  </TableCell>
                  <TableCell className="text-gray-800 text-sm">{addon.nama}</TableCell>
                  <TableCell className="text-gray-800 text-sm">
                    {Number(addon.harga) === 0 ? "Gratis" : formatRupiah(Number(addon.harga))}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => onEdit(addon)} 
                        className="flex items-center justify-center size-7 bg-[#3874BC] hover:bg-[#2c5b96] text-white rounded-md transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button 
                        onClick={() => setDeleteTarget(addon)} 
                        className="flex items-center justify-center size-7 bg-[#ff6b00] hover:bg-[#e65a00] text-white rounded-md transition-colors cursor-pointer"
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

      {meta && meta.total > 0 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-gray-500">
            Menampilkan Halaman <span className="font-medium text-gray-900">{meta.current_page}</span> dari <span className="font-medium text-gray-900">{meta.last_page}</span> halaman
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p: number) => Math.max(1, p - 1))}
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
                  className={pageNum === page 
                    ? "size-8 rounded-full text-xs font-medium bg-[#1D5E84] hover:bg-[#154663] text-white transition-colors cursor-pointer" 
                    : "size-8 rounded-full text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"}
                >
                  {pageNum}
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p: number) => Math.min(meta.last_page, p + 1))}
              disabled={page === meta.last_page}
              className="h-8 rounded-full px-4 text-xs font-medium cursor-pointer"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
        title="Hapus Add On"
        description={`Apakah Anda yakin ingin menghapus add on "${deleteTarget?.nama}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Ya, Hapus"
        cancelLabel="Batal"
        variant="danger"
        onConfirm={() => {
          if (deleteTarget) deleteAddon(deleteTarget.id, {
            onSuccess: () => toast.success("Add On berhasil dihapus"),
            onError: () => toast.error("Gagal menghapus Add On")
          })
          setDeleteTarget(null)
        }}
      />
    </>
  )
}
