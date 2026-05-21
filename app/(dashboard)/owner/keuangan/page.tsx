"use client"

import { useState } from "react"
import { Settings, Bell, Search, ChevronDown, Store, Coins, TrendingDown, CircleDollarSign, Loader2, ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { Badge } from "@/components/ui/badge"

// Hooks
import { useKeuanganSummary, useKeuanganList } from "@/hooks/use-keuangan"
import { useOutlets } from "@/hooks/use-outlets"

const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number)
}

export default function DetailKeuanganPage() {
  const [range, setRange] = useState("7days")
  const [tipe, setTipe] = useState("semua")
  const [outletId, setOutletId] = useState<string>("")
  const [page, setPage] = useState(1)

  // Fetch Data
  const { data: summaryResponse, isLoading: isLoadingSummary } = useKeuanganSummary(range, outletId || undefined)
  const { data: listResponse, isLoading: isLoadingList } = useKeuanganList(page, range, tipe, outletId || undefined, 15)
  const { data: outletsResponse } = useOutlets()

  const summary = summaryResponse?.data
  const transactions = listResponse?.data || []
  const meta = listResponse?.meta
  const outlets = outletsResponse?.data || []

  const rangeLabels: Record<string, string> = {
    "1day": "Hari Ini",
    "7days": "7 Hari Terakhir",
    "30days": "30 Hari Terakhir"
  }

  const tipeLabels: Record<string, string> = {
    "semua": "Semua Tipe",
    "pendapatan": "Pendapatan",
    "pengeluaran": "Pengeluaran",
    "kerugian": "Kerugian"
  }

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
        <div className="flex items-center gap-3">
          <button type="button" className="flex items-center justify-center size-9 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors" aria-label="Settings">
            <Settings className="size-4" />
          </button>
          <button type="button" className="relative flex items-center justify-center size-9 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors" aria-label="Notifications">
            <Bell className="size-4" />
            <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-orange-500 ring-2 ring-white" />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-6 space-y-6">
        {/* Header Text */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Detail Keuangan</h2>
          <p className="text-sm text-gray-500 mt-0.5">Detail Informasi Keuangan</p>
        </div>

        {/* Summary Cards */}
        {isLoadingSummary ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : summary ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#2A49B8] text-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Store className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium opacity-90">Total Pendapatan</span>
              </div>
              <h3 className="text-2xl font-bold">{formatRupiah(summary.total_pendapatan)}</h3>
            </div>

            <div className="bg-[#29A364] text-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Coins className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium opacity-90">Total Pengeluaran</span>
              </div>
              <h3 className="text-2xl font-bold">{formatRupiah(summary.total_pengeluaran)}</h3>
            </div>

            <div className="bg-[#F29C38] text-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/20 p-2 rounded-lg">
                  <TrendingDown className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium opacity-90">Total Kerugian</span>
              </div>
              <h3 className="text-2xl font-bold">{formatRupiah(summary.total_kerugian)}</h3>
            </div>

            <div className="bg-[#5A9BE7] text-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/20 p-2 rounded-lg">
                  <CircleDollarSign className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium opacity-90">Total Keuntungan</span>
              </div>
              <h3 className="text-2xl font-bold">{formatRupiah(summary.total_keuntungan)}</h3>
              {/* Background Icon Decoration */}
              <CircleDollarSign className="absolute -bottom-6 -right-4 w-32 h-32 text-white/10" />
            </div>
          </div>
        ) : null}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1.5 text-sm border-gray-200 text-gray-700 h-9 rounded-full px-4 bg-white">
                  {rangeLabels[range]} <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40">
                {Object.entries(rangeLabels).map(([key, label]) => (
                  <DropdownMenuItem key={key} onClick={() => { setRange(key); setPage(1); }} className={cn("cursor-pointer", range === key && "font-medium text-blue-600")}>
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1.5 text-sm border-gray-200 text-gray-700 h-9 rounded-full px-4 bg-white">
                  {tipeLabels[tipe]} <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40">
                {Object.entries(tipeLabels).map(([key, label]) => (
                  <DropdownMenuItem key={key} onClick={() => { setTipe(key); setPage(1); }} className={cn("cursor-pointer", tipe === key && "font-medium text-blue-600")}>
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1.5 text-sm border-gray-200 text-gray-700 h-9 rounded-full px-4 bg-white whitespace-nowrap">
                  {outletId ? outlets.find(o => o.id === outletId)?.nama_outlet : "Semua Outlet"} <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 max-h-60 overflow-y-auto">
                <DropdownMenuItem onClick={() => { setOutletId(""); setPage(1); }} className={cn("cursor-pointer", !outletId && "font-medium text-blue-600")}>
                  Semua Outlet
                </DropdownMenuItem>
                {outlets.map((outlet) => (
                  <DropdownMenuItem key={outlet.id} onClick={() => { setOutletId(outlet.id); setPage(1); }} className={cn("cursor-pointer", outletId === outlet.id && "font-medium text-blue-600")}>
                    {outlet.nama_outlet}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 hover:bg-gray-100 border-gray-200">
                <TableHead className="w-32 text-gray-600 font-semibold text-sm">Tanggal</TableHead>
                <TableHead className="text-gray-600 font-semibold text-sm">ID Transaksi</TableHead>
                <TableHead className="text-gray-600 font-semibold text-sm">Outlet</TableHead>
                <TableHead className="w-36 text-gray-600 font-semibold text-sm text-center">Tipe</TableHead>
                <TableHead className="text-gray-600 font-semibold text-sm">Keterangan</TableHead>
                <TableHead className="text-gray-600 font-semibold text-sm text-right">Nominal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingList ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto" />
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-400 py-12 text-sm">Tidak ada transaksi ditemukan.</TableCell>
                </TableRow>
              ) : (
                transactions.map((row) => (
                  <TableRow key={row.id} className="hover:bg-gray-50/50 border-gray-100 transition-colors">
                    <TableCell className="text-gray-600 text-sm whitespace-nowrap">{row.tanggal}</TableCell>
                    <TableCell className="text-gray-500 text-sm font-mono text-xs max-w-[120px] truncate" title={row.id}>{row.id}</TableCell>
                    <TableCell className="text-gray-800 text-sm">{row.outlet}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={cn(
                        "rounded-full px-3 py-0.5 text-xs font-medium uppercase",
                        row.tipe === "pendapatan" ? "border-emerald-400 text-emerald-700 bg-emerald-50" : 
                        row.tipe === "pengeluaran" ? "border-rose-400 text-rose-700 bg-rose-50" : 
                        "border-orange-400 text-orange-700 bg-orange-50"
                      )}>
                        {row.tipe}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm truncate max-w-[200px]" title={row.keterangan}>{row.keterangan}</TableCell>
                    <TableCell className="text-gray-800 font-medium text-sm text-right whitespace-nowrap">
                      {row.tipe === 'pendapatan' ? '+' : '-'}{formatRupiah(row.nominal)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500">
              Menampilkan <span className="font-medium text-gray-900">{meta.from}</span> sampai <span className="font-medium text-gray-900">{meta.to}</span> dari <span className="font-medium text-gray-900">{meta.total}</span> data
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-9 px-3 border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 bg-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, meta.last_page) }, (_, i) => {
                  let pageNum = page
                  if (meta.last_page <= 5) pageNum = i + 1
                  else if (page <= 3) pageNum = i + 1
                  else if (page >= meta.last_page - 2) pageNum = meta.last_page - 4 + i
                  else pageNum = page - 2 + i

                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(pageNum)}
                      className={cn(
                        "h-9 w-9 p-0 border-gray-200",
                        page === pageNum 
                          ? "bg-[#1D5E84] hover:bg-[#154663] text-white border-transparent" 
                          : "text-gray-600 hover:bg-gray-50 bg-white"
                      )}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                disabled={page === meta.last_page}
                className="h-9 px-3 border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 bg-white"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
