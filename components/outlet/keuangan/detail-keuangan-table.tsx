"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn, formatRupiah } from "@/lib/utils"
import type { OutletKeuanganTransaksi } from "@/types/outlet/keuangan"
import { format } from "date-fns"
import { id } from "date-fns/locale"

interface Props {
  transaksi: OutletKeuanganTransaksi[]
  meta?: {
    current_page: number
    per_page: number
    total: number
    last_page: number
  }
  page: number
  setPage: (page: number) => void
  isLoading: boolean
  tipe: string
}

export function DetailKeuanganTable({ transaksi, meta, page, setPage, isLoading, tipe }: Props) {
  // If `tipe` is not "semua", the backend is still returning all types for the page, 
  // so client-side filtering might mess up pagination totals unless we do server-side filtering too.
  // Assuming for now that we filter locally on the fetched page.
  const filtered = tipe === "semua"
    ? transaksi
    : transaksi.filter((t) => t.tipe === tipe)

  const lastPage = meta ? meta.last_page : 1
  const currentPage = meta ? meta.current_page : 1

  return (
    <>
      <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100 hover:bg-gray-100 border-gray-200">
              <TableHead className="w-32 text-gray-600 font-semibold text-sm">Tanggal</TableHead>
              <TableHead className="w-20 text-gray-600 font-semibold text-sm">Waktu</TableHead>
              <TableHead className="text-gray-600 font-semibold text-sm">ID Transaksi</TableHead>
              <TableHead className="w-36 text-gray-600 font-semibold text-sm text-center">Tipe</TableHead>
              <TableHead className="text-gray-600 font-semibold text-sm">Keterangan</TableHead>
              <TableHead className="text-gray-600 font-semibold text-sm text-right">Nominal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto" />
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-400 py-12 text-sm">
                  Tidak ada transaksi ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((row, idx) => (
                <TableRow key={`${row.id}-${idx}`} className="hover:bg-gray-50/50 border-gray-100 transition-colors">
                  <TableCell className="text-gray-600 text-sm whitespace-nowrap">
                    {row.tanggal ? format(new Date(row.tanggal), "dd MMM yyyy", { locale: id }) : "-"}
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm whitespace-nowrap">
                    {row.waktu || "-"}
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm font-mono max-w-[120px] truncate" title={row.id}>
                    {row.id}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-full px-3 py-0.5 text-xs font-medium uppercase",
                        row.tipe === "pendapatan" ? "border-emerald-400 text-emerald-700 bg-emerald-50" :
                        row.tipe === "pengeluaran" ? "border-rose-400 text-rose-700 bg-rose-50" :
                        "border-orange-400 text-orange-700 bg-orange-50"
                      )}
                    >
                      {row.tipe}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm truncate max-w-[220px]" title={row.keterangan}>
                    {row.keterangan}
                  </TableCell>
                  <TableCell className="text-gray-800 font-medium text-sm text-right whitespace-nowrap">
                    <span className={row.tipe === "pendapatan" ? "text-emerald-600" : "text-rose-500"}>
                      {row.tipe === "pendapatan" ? "+" : "-"}{formatRupiah(row.nominal)}
                    </span>
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
            Menampilkan Halaman{" "}
            <span className="font-medium text-gray-900">{currentPage}</span> dari{" "}
            <span className="font-medium text-gray-900">{lastPage}</span> halaman
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="h-8 rounded-full px-4 text-xs font-medium cursor-pointer"
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: lastPage }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={cn(
                    "size-8 rounded-full text-xs font-medium transition-colors",
                    currentPage === pageNum
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
              onClick={() => setPage(Math.min(lastPage, page + 1))}
              disabled={currentPage === lastPage}
              className="h-8 rounded-full px-4 text-xs font-medium cursor-pointer"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
