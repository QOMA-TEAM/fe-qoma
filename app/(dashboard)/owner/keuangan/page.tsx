"use client"

import { useState, useMemo } from "react"
import { Settings, Bell, Search, ChevronDown, ChevronUp, ChevronsUpDown, Store, Coins, TrendingDown, CircleDollarSign } from "lucide-react"
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

// ── Dummy Data ──
type KeuanganItem = {
  id: number
  outlet: string
  startDate: string
  endDate: string
  keuntungan: number
  pengeluaran: number
}

const keuanganList: KeuanganItem[] = [
  { id: 1, outlet: "Budiono Burjo", startDate: "2026-04-29", endDate: "2026-04-29", keuntungan: 100000, pengeluaran: 10000 },
  { id: 2, outlet: "Sari Dewi", startDate: "2026-05-15", endDate: "2026-05-15", keuntungan: 200000, pengeluaran: 20000 },
  { id: 3, outlet: "Arief Hasan", startDate: "2026-06-10", endDate: "2026-06-10", keuntungan: 150000, pengeluaran: 15000 },
  { id: 4, outlet: "Rina Sari", startDate: "2026-06-25", endDate: "2026-06-25", keuntungan: 250000, pengeluaran: 25000 },
  { id: 5, outlet: "Budi Santoso", startDate: "2026-06-26", endDate: "2026-06-26", keuntungan: 300000, pengeluaran: 30000 },
  { id: 6, outlet: "Siti Aminah", startDate: "2026-06-27", endDate: "2026-06-27", keuntungan: 150000, pengeluaran: 15000 },
  { id: 7, outlet: "Joko Widodo", startDate: "2026-06-28", endDate: "2026-06-28", keuntungan: 500000, pengeluaran: 50000 },
  { id: 8, outlet: "Dewi Lestari", startDate: "2026-06-29", endDate: "2026-06-29", keuntungan: 400000, pengeluaran: 40000 },
  { id: 9, outlet: "Agus Prabowo", startDate: "2026-06-30", endDate: "2026-06-30", keuntungan: 350000, pengeluaran: 35000 },
  { id: 10, outlet: "Nina Fitria", startDate: "2026-07-01", endDate: "2026-07-01", keuntungan: 450000, pengeluaran: 45000 },
  { id: 11, outlet: "Hendri Gani", startDate: "2026-07-02", endDate: "2026-07-02", keuntungan: 550000, pengeluaran: 55000 },
  { id: 12, outlet: "Lina Safitri", startDate: "2026-07-03", endDate: "2026-07-03", keuntungan: 600000, pengeluaran: 60000 },
]

type SortKey = "id" | "outlet" | "startDate" | "endDate" | "keuntungan" | "pengeluaran"
type SortDir = "asc" | "desc"

export default function DetailKeuanganPage() {
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("id")
  const [sortDir, setSortDir] = useState<SortDir>("asc")

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((p) => (p === "asc" ? "desc" : "asc"))
    else { setSortKey(key); setSortDir("asc") }
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return keuanganList.filter((item) => item.outlet.toLowerCase().includes(q))
  }, [search])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sortKey]; const bv = b[sortKey]
      if (av < bv) return sortDir === "asc" ? -1 : 1
      if (av > bv) return sortDir === "asc" ? 1 : -1
      return 0
    })
  }, [filtered, sortKey, sortDir])

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronsUpDown className="w-3 h-3 ml-1 opacity-40" />
    return sortDir === "asc" ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />
  }

  const columns: { key: SortKey; label: string; className?: string }[] = [
    { key: "id", label: "No", className: "w-16 text-center" },
    { key: "outlet", label: "Outlet", className: "text-center" },
    { key: "startDate", label: "Start Date", className: "text-center" },
    { key: "endDate", label: "End Date", className: "text-center" },
    { key: "keuntungan", label: "Keuntungan", className: "text-center" },
    { key: "pengeluaran", label: "Pengeluaran", className: "text-center" },
  ]

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: "id", label: "No" },
    { key: "keuntungan", label: "Keuntungan" },
    { key: "pengeluaran", label: "Pengeluaran" },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/40">
      {/* Top Bar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-6 shadow-sm">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/owner/dashboard" className="text-sm text-muted-foreground">QOMA</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="text-sm text-muted-foreground">KEUANGAN</span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm">Detail Keuangan</BreadcrumbPage>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#2A49B8] text-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 p-2 rounded-lg">
                <Store className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium opacity-90">Total Pendapatan</span>
            </div>
            <h3 className="text-2xl font-bold">Rp. 12.000.000</h3>
          </div>

          <div className="bg-[#29A364] text-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 p-2 rounded-lg">
                <Coins className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium opacity-90">Total Pengeluaran</span>
            </div>
            <h3 className="text-2xl font-bold">Rp. 8.000.000</h3>
          </div>

          <div className="bg-[#F29C38] text-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 p-2 rounded-lg">
                <TrendingDown className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium opacity-90">Total Kerugian</span>
            </div>
            <h3 className="text-2xl font-bold">Rp. 2.000.000</h3>
          </div>

          <div className="bg-[#5A9BE7] text-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 p-2 rounded-lg">
                <CircleDollarSign className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium opacity-90">Total Keuntungan</span>
            </div>
            <h3 className="text-2xl font-bold">Rp. 10.000.000</h3>
            {/* Background Icon Decoration */}
            <CircleDollarSign className="absolute -bottom-6 -right-4 w-32 h-32 text-white/10" />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-end gap-2 flex-wrap pt-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1.5 text-sm border-gray-200 text-gray-700 h-9 rounded-full px-4 bg-white">
                Sort By <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              {sortOptions.map((item) => (
                <DropdownMenuItem key={item.key} onClick={() => handleSort(item.key)} className={cn("cursor-pointer", sortKey === item.key && "font-medium text-blue-600")}>
                  {item.label}
                  {sortKey === item.key && <span className="ml-auto text-xs text-gray-400">{sortDir === "asc" ? "↑" : "↓"}</span>}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="relative">
            <Input 
              placeholder="Search" 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="pr-9 h-9 w-44 text-sm border-gray-200 rounded-full bg-white" 
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 hover:bg-gray-100 border-gray-200">
                {columns.map((col) => {
                  const isSortable = col.key === "id" || col.key === "keuntungan" || col.key === "pengeluaran"
                  return (
                    <TableHead 
                      key={col.key} 
                      className={cn(col.className, isSortable && "cursor-pointer select-none")} 
                      onClick={isSortable ? () => handleSort(col.key) : undefined}
                    >
                      <div className={cn("flex items-center text-gray-600 font-semibold text-sm", (col.key === "id" || col.key === "outlet" || col.key === "startDate" || col.key === "endDate" || col.key === "keuntungan" || col.key === "pengeluaran") && "justify-center")}>
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
              {sorted.map((row) => (
                <TableRow key={row.id} className="hover:bg-gray-50/50 border-gray-100 transition-colors">
                  <TableCell className="text-gray-500 text-sm text-center">{row.id}</TableCell>
                  <TableCell className="text-gray-800 text-sm text-center">{row.outlet}</TableCell>
                  <TableCell className="text-gray-600 text-sm text-center">{row.startDate}</TableCell>
                  <TableCell className="text-gray-600 text-sm text-center">{row.endDate}</TableCell>
                  <TableCell className="text-gray-600 text-sm text-center">Rp. {row.keuntungan.toLocaleString("id-ID")}</TableCell>
                  <TableCell className="text-gray-600 text-sm text-center">Rp. {row.pengeluaran.toLocaleString("id-ID")}</TableCell>
                  <TableCell className="text-center">
                    <button onClick={() => console.log("View Keuangan", row.id)} className="bg-green-100 hover:bg-green-200 text-green-700 text-xs font-bold h-7 px-5 rounded-full transition-colors">
                      VIEW
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              {sorted.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-400 py-12 text-sm">Tidak ada data ditemukan.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  )
}
