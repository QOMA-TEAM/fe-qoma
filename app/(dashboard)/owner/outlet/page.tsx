"use client"

import { useState, useMemo } from "react"
import { Settings, Bell, Search, ChevronDown, ChevronUp, ChevronsUpDown, Plus } from "lucide-react"
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
import { TambahOutletDialog } from "@/components/outlet/tambah-outlet-dialog"
import { DetailOutletDialog } from "@/components/outlet/detail-outlet-dialog"

// ── Dummy Data ──
export type Outlet = {
  id: number
  namaPerusahaan: string
  alamatPerusahaan: string
  emailAdmin: string
  adminCabang: string
  status: "Aktif" | "Nonaktif"
  subscriptionId: string
  planId: string
  startDate: string
  endDate: string
  totalOutlet: number
  createdAt: string
  updatedAt: string
}

const outlets: Outlet[] = [
  { id: 1, namaPerusahaan: "Budiono Burjo", alamatPerusahaan: "Jl. Setiabudi No 45", emailAdmin: "budijo@gmail.com", adminCabang: "Budiono", status: "Aktif", subscriptionId: "SUB001", planId: "PLN001", startDate: "2026-04-29", endDate: "2026-05-29", totalOutlet: 5, createdAt: "2026-04-29", updatedAt: "2026-04-29" },
  { id: 2, namaPerusahaan: "Warung Makan Bahari", alamatPerusahaan: "Jl. Gajah Mada No 12", emailAdmin: "bahari@gmail.com", adminCabang: "Siti Bahari", status: "Aktif", subscriptionId: "SUB002", planId: "PLN001", startDate: "2026-05-01", endDate: "2026-06-01", totalOutlet: 3, createdAt: "2026-05-01", updatedAt: "2026-05-01" },
  { id: 3, namaPerusahaan: "Kedai Kopi Nusantara", alamatPerusahaan: "Jl. Diponegoro No 78", emailAdmin: "nusantara@gmail.com", adminCabang: "Andi Pratama", status: "Aktif", subscriptionId: "SUB003", planId: "PLN002", startDate: "2026-05-05", endDate: "2026-06-05", totalOutlet: 8, createdAt: "2026-05-05", updatedAt: "2026-05-05" },
  { id: 4, namaPerusahaan: "Restoran Padang Jaya", alamatPerusahaan: "Jl. Sudirman No 33", emailAdmin: "padangjaya@gmail.com", adminCabang: "Hendra Wijaya", status: "Aktif", subscriptionId: "SUB004", planId: "PLN001", startDate: "2026-05-10", endDate: "2026-06-10", totalOutlet: 2, createdAt: "2026-05-10", updatedAt: "2026-05-10" },
  { id: 5, namaPerusahaan: "Bakso Malang Pak Kumis", alamatPerusahaan: "Jl. Ahmad Yani No 55", emailAdmin: "pakkumis@gmail.com", adminCabang: "Agus Salim", status: "Nonaktif", subscriptionId: "SUB005", planId: "PLN001", startDate: "2026-03-15", endDate: "2026-04-15", totalOutlet: 1, createdAt: "2026-03-15", updatedAt: "2026-04-15" },
  { id: 6, namaPerusahaan: "Sate Madura Cak Imin", alamatPerusahaan: "Jl. Pemuda No 21", emailAdmin: "cakimin@gmail.com", adminCabang: "Imam Maulana", status: "Aktif", subscriptionId: "SUB006", planId: "PLN002", startDate: "2026-05-12", endDate: "2026-06-12", totalOutlet: 4, createdAt: "2026-05-12", updatedAt: "2026-05-12" },
  { id: 7, namaPerusahaan: "Ayam Geprek Bu Sari", alamatPerusahaan: "Jl. Pahlawan No 67", emailAdmin: "busari@gmail.com", adminCabang: "Sari Dewi", status: "Aktif", subscriptionId: "SUB007", planId: "PLN001", startDate: "2026-05-08", endDate: "2026-06-08", totalOutlet: 6, createdAt: "2026-05-08", updatedAt: "2026-05-08" },
  { id: 8, namaPerusahaan: "Mie Ayam Bangka", alamatPerusahaan: "Jl. Veteran No 14", emailAdmin: "bangka@gmail.com", adminCabang: "Liem Hock", status: "Aktif", subscriptionId: "SUB008", planId: "PLN001", startDate: "2026-05-03", endDate: "2026-06-03", totalOutlet: 2, createdAt: "2026-05-03", updatedAt: "2026-05-03" },
  { id: 9, namaPerusahaan: "Nasi Goreng Kebon Sirih", alamatPerusahaan: "Jl. Kebon Sirih No 90", emailAdmin: "kebonsirih@gmail.com", adminCabang: "Rudi Hartono", status: "Aktif", subscriptionId: "SUB009", planId: "PLN002", startDate: "2026-04-20", endDate: "2026-05-20", totalOutlet: 3, createdAt: "2026-04-20", updatedAt: "2026-04-20" },
  { id: 10, namaPerusahaan: "Martabak San Francisco", alamatPerusahaan: "Jl. Gatot Subroto No 5", emailAdmin: "sanfran@gmail.com", adminCabang: "David Chen", status: "Aktif", subscriptionId: "SUB010", planId: "PLN001", startDate: "2026-05-14", endDate: "2026-06-14", totalOutlet: 7, createdAt: "2026-05-14", updatedAt: "2026-05-14" },
  { id: 11, namaPerusahaan: "Es Teler 99", alamatPerusahaan: "Jl. Thamrin No 88", emailAdmin: "esteler@gmail.com", adminCabang: "Tuti Wulandari", status: "Aktif", subscriptionId: "SUB011", planId: "PLN002", startDate: "2026-05-06", endDate: "2026-06-06", totalOutlet: 10, createdAt: "2026-05-06", updatedAt: "2026-05-06" },
  { id: 12, namaPerusahaan: "Pecel Lele Lela", alamatPerusahaan: "Jl. Mangga Besar No 31", emailAdmin: "lela@gmail.com", adminCabang: "Lela Anggraini", status: "Nonaktif", subscriptionId: "SUB012", planId: "PLN001", startDate: "2026-03-01", endDate: "2026-04-01", totalOutlet: 2, createdAt: "2026-03-01", updatedAt: "2026-04-01" },
  { id: 13, namaPerusahaan: "Warung Tekko", alamatPerusahaan: "Jl. Hayam Wuruk No 19", emailAdmin: "tekko@gmail.com", adminCabang: "Bambang Supriadi", status: "Aktif", subscriptionId: "SUB013", planId: "PLN001", startDate: "2026-05-11", endDate: "2026-06-11", totalOutlet: 4, createdAt: "2026-05-11", updatedAt: "2026-05-11" },
  { id: 14, namaPerusahaan: "Roti Bakar Eddy", alamatPerusahaan: "Jl. Asia Afrika No 42", emailAdmin: "eddy@gmail.com", adminCabang: "Eddy Kurniawan", status: "Aktif", subscriptionId: "SUB014", planId: "PLN002", startDate: "2026-05-09", endDate: "2026-06-09", totalOutlet: 3, createdAt: "2026-05-09", updatedAt: "2026-05-09" },
  { id: 15, namaPerusahaan: "Gudeg Yu Djum", alamatPerusahaan: "Jl. Malioboro No 7", emailAdmin: "yudjum@gmail.com", adminCabang: "Yulianti", status: "Aktif", subscriptionId: "SUB015", planId: "PLN001", startDate: "2026-05-02", endDate: "2026-06-02", totalOutlet: 5, createdAt: "2026-05-02", updatedAt: "2026-05-02" },
  { id: 16, namaPerusahaan: "Soto Betawi H. Mamat", alamatPerusahaan: "Jl. Cikini Raya No 60", emailAdmin: "hmamat@gmail.com", adminCabang: "Mamat Rahmat", status: "Aktif", subscriptionId: "SUB016", planId: "PLN001", startDate: "2026-05-13", endDate: "2026-06-13", totalOutlet: 2, createdAt: "2026-05-13", updatedAt: "2026-05-13" },
]

type SortKey = "id" | "namaPerusahaan" | "alamatPerusahaan" | "emailAdmin" | "adminCabang"
type SortDir = "asc" | "desc"

export default function KelolaOutletPage() {
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("id")
  const [sortDir, setSortDir] = useState<SortDir>("asc")
  const [tambahOpen, setTambahOpen] = useState(false)
  const [detailOutlet, setDetailOutlet] = useState<Outlet | null>(null)

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((p) => (p === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return outlets.filter(
      (o) =>
        o.namaPerusahaan.toLowerCase().includes(q) ||
        o.emailAdmin.toLowerCase().includes(q) ||
        o.adminCabang.toLowerCase().includes(q)
    )
  }, [search])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      if (av < bv) return sortDir === "asc" ? -1 : 1
      if (av > bv) return sortDir === "asc" ? 1 : -1
      return 0
    })
  }, [filtered, sortKey, sortDir])

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronsUpDown className="w-3 h-3 ml-1 opacity-40" />
    return sortDir === "asc" ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />
  }

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: "id", label: "No" },
    { key: "namaPerusahaan", label: "Nama Perusahaan" },
    { key: "alamatPerusahaan", label: "Alamat" },
    { key: "adminCabang", label: "Admin Cabang" },
  ]

  const columns: { key: SortKey; label: string; className?: string }[] = [
    { key: "id", label: "No", className: "w-16" },
    { key: "namaPerusahaan", label: "Nama Perusahaan" },
    { key: "alamatPerusahaan", label: "Alamat Perusahaan" },
    { key: "emailAdmin", label: "Email Admin Cabang" },
    { key: "adminCabang", label: "Admin Cabang" },
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
              <span className="text-sm text-muted-foreground">KELOLA</span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm">Kelola Outlet</BreadcrumbPage>
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
      <main className="flex-1 overflow-auto p-6 space-y-6">
        {/* Title + Controls */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Kelola Outlet</h2>
            <p className="text-sm text-gray-500 mt-0.5">Informasi detail Data Tenant</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Sort By */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1.5 text-sm border-gray-200 text-gray-700 h-9 rounded-full px-4">
                  Sort By <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {sortOptions.map((item) => (
                  <DropdownMenuItem key={item.key} onClick={() => handleSort(item.key)} className={cn("cursor-pointer", sortKey === item.key && "font-medium text-blue-600")}>
                    {item.label}
                    {sortKey === item.key && <span className="ml-auto text-xs text-gray-400">{sortDir === "asc" ? "↑" : "↓"}</span>}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Search */}
            <div className="relative">
              <Input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} className="pr-9 h-9 w-44 text-sm border-gray-200 rounded-full" />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            {/* Tambah Outlet */}
            <Button onClick={() => setTambahOpen(true)} className="h-9 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white gap-1.5 px-4 text-sm">
              <Plus className="size-4" /> Tambah Outlet
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-gray-200">
                {columns.map((col) => (
                  <TableHead key={col.key} className={cn("cursor-pointer select-none", col.className)} onClick={() => handleSort(col.key)}>
                    <div className="flex items-center text-gray-600 font-semibold text-sm">
                      {col.label}
                      <SortIcon col={col.key} />
                    </div>
                  </TableHead>
                ))}
                <TableHead className="text-gray-600 font-semibold text-sm">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((row) => (
                <TableRow key={row.id} className="hover:bg-gray-50/50 border-gray-100 transition-colors">
                  <TableCell className="text-gray-500 text-sm">{row.id}</TableCell>
                  <TableCell className="text-gray-800 text-sm">{row.namaPerusahaan}</TableCell>
                  <TableCell className="text-gray-600 text-sm">{row.alamatPerusahaan}</TableCell>
                  <TableCell className="text-gray-600 text-sm">{row.emailAdmin}</TableCell>
                  <TableCell className="text-gray-600 text-sm">{row.adminCabang}</TableCell>
                  <TableCell>
                    <button onClick={() => setDetailOutlet(row)} className="bg-green-100 hover:bg-green-200 text-green-700 text-xs font-bold h-7 px-5 rounded-full transition-colors">
                      VIEW
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              {sorted.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-400 py-12 text-sm">Tidak ada data ditemukan.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>

      {/* Dialogs */}
      <TambahOutletDialog open={tambahOpen} onOpenChange={setTambahOpen} />
      <DetailOutletDialog outlet={detailOutlet} onClose={() => setDetailOutlet(null)} />
    </div>
  )
}
