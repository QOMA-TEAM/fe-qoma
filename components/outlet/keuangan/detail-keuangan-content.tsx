"use client"

import { useState } from "react"
import { useOutletKeuangan } from "@/hooks/outlet/use-keuangan"
import { DetailKeuanganCards } from "./detail-keuangan-cards"
import { DetailKeuanganFilter } from "./detail-keuangan-filter"
import { DetailKeuanganTable } from "./detail-keuangan-table"

export function DetailKeuanganContent() {
  const [range, setRange] = useState("7days")
  const [tipe, setTipe] = useState("semua")
  const [page, setPage] = useState(1)

  // Reset page when filter changes
  const handleRangeChange = (v: string) => { setRange(v); setPage(1); }
  const handleTipeChange = (v: string) => { setTipe(v); setPage(1); }

  const { data, isLoading } = useOutletKeuangan(range, page, tipe)

  const cards = data?.data?.cards
  const transaksi = data?.data?.transaksi?.data ?? []
  const meta = data?.data?.transaksi?.meta

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Detail Keuangan</h1>
        <p className="text-sm text-gray-500 mt-0.5">Ringkasan laporan keuangan outlet Anda</p>
      </div>

      {/* Summary Cards */}
      <DetailKeuanganCards cards={cards} isLoading={isLoading} />

      {/* Transaksi Section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-base font-semibold text-gray-800">Riwayat Transaksi</h2>
          <DetailKeuanganFilter
            range={range}
            setRange={handleRangeChange}
            tipe={tipe}
            setTipe={handleTipeChange}
          />
        </div>

        <DetailKeuanganTable 
          transaksi={transaksi} 
          meta={meta}
          page={page}
          setPage={setPage}
          isLoading={isLoading} 
        />
      </div>
    </div>
  )
}
