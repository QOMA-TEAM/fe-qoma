"use client"

import { useState } from "react"
import { HeaderActions } from "@/components/dashboard/header-actions"
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { KeuanganSummaryCards } from "@/components/owner/keuangan/keuangan-summary-cards"
import { KeuanganFilterControls } from "@/components/owner/keuangan/keuangan-filter-controls"
import { KeuanganTable } from "@/components/owner/keuangan/keuangan-table"

export default function DetailKeuanganPage() {
  const [range, setRange] = useState("7days")
  const [tipe, setTipe] = useState("semua")
  const [outletId, setOutletId] = useState<string>("")
  const [page, setPage] = useState(1)

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/40">
      {/* Top Bar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-6 shadow-sm">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <span className="text-sm text-muted-foreground">KEUANGAN</span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm">Detail</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <HeaderActions />
      </header>

      {/* Content */}
      <main className="flex-1 p-6 space-y-6">
        {/* Header Text */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Detail Keuangan</h2>
          <p className="text-sm text-gray-500 mt-0.5">Detail Informasi Keuangan</p>
        </div>

        {/* Summary Cards */}
        <KeuanganSummaryCards range={range} outletId={outletId} />

        {/* Controls */}
        <KeuanganFilterControls 
          range={range} setRange={setRange}
          tipe={tipe} setTipe={setTipe}
          outletId={outletId} setOutletId={setOutletId}
          setPage={setPage}
        />

        {/* Table */}
        <KeuanganTable 
          page={page} setPage={setPage}
          range={range} tipe={tipe} outletId={outletId}
        />
      </main>
    </div>
  )
}
