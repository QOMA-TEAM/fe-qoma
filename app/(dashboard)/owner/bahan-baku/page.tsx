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
import { BahanBakuFormDialog } from "@/components/bahan-baku/bahan-baku-form-dialog"

// ── Types & Dummy Data ──
type BahanBaku = {
  id: number
  nama: string
  satuan: string
  peringatanStock: number
}

const bahanBakuList: BahanBaku[] = [
  { id: 1, nama: "Bawang Putih", satuan: "Pcs", peringatanStock: 5 },
  { id: 2, nama: "Bawang Merah", satuan: "Pcs", peringatanStock: 5 },
  { id: 3, nama: "Cabai Merah", satuan: "Pcs", peringatanStock: 5 },
  { id: 4, nama: "Cabai Hijau", satuan: "Pcs", peringatanStock: 5 },
  { id: 5, nama: "Tomat", satuan: "Pcs", peringatanStock: 5 },
  { id: 6, nama: "Wortel", satuan: "Pcs", peringatanStock: 5 },
  { id: 7, nama: "Kentang", satuan: "Pcs", peringatanStock: 5 },
  { id: 8, nama: "Brokoli", satuan: "Pcs", peringatanStock: 5 },
  { id: 9, nama: "Kembang Kol", satuan: "Pcs", peringatanStock: 5 },
  { id: 10, nama: "Bayam", satuan: "Pcs", peringatanStock: 5 },
  { id: 11, nama: "Sawi", satuan: "Pcs", peringatanStock: 5 },
  { id: 12, nama: "Kacang Panjang", satuan: "Pcs", peringatanStock: 5 },
  { id: 13, nama: "Timun", satuan: "Pcs", peringatanStock: 5 },
  { id: 14, nama: "Labu", satuan: "Pcs", peringatanStock: 5 },
  { id: 15, nama: "Paprika", satuan: "Pcs", peringatanStock: 5 },
  { id: 16, nama: "Zucchini", satuan: "Pcs", peringatanStock: 5 },
  { id: 17, nama: "Daun Salam", satuan: "Pcs", peringatanStock: 5 },
  { id: 18, nama: "Jahe", satuan: "Pcs", peringatanStock: 5 },
  { id: 19, nama: "Kunyit", satuan: "Pcs", peringatanStock: 5 },
  { id: 20, nama: "Lengkuas", satuan: "Pcs", peringatanStock: 5 },
]

type SortKey = "id" | "nama" | "satuan"
type SortDir = "asc" | "desc"

export default function KelolaBahanBakuPage() {
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("id")
  const [sortDir, setSortDir] = useState<SortDir>("asc")
  const [tambahOpen, setTambahOpen] = useState(false)
  const [editItem, setEditItem] = useState<BahanBaku | null>(null)

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((p) => (p === "asc" ? "desc" : "asc"))
    else { setSortKey(key); setSortDir("asc") }
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return bahanBakuList.filter((b) => b.nama.toLowerCase().includes(q) || b.satuan.toLowerCase().includes(q))
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

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: "id", label: "No" },
    { key: "nama", label: "Nama Bahan Baku" },
    { key: "satuan", label: "Satuan" },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/40">
      {/* Top Bar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-6 shadow-sm">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="/owner/dashboard" className="text-sm text-muted-foreground">QOMA</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><span className="text-sm text-muted-foreground">KELOLA</span></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage className="text-sm">Kelola Bahan Baku</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-3">
          <button type="button" className="flex items-center justify-center size-9 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors" aria-label="Settings"><Settings className="size-4" /></button>
          <button type="button" className="relative flex items-center justify-center size-9 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors" aria-label="Notifications">
            <Bell className="size-4" />
            <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-orange-500 ring-2 ring-white" />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto p-6 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Kelola Bahan Baku</h2>
            <p className="text-sm text-gray-500 mt-0.5">Informasi detail bahan baku</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
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
            <div className="relative">
              <Input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} className="pr-9 h-9 w-44 text-sm border-gray-200 rounded-full" />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <Button onClick={() => setTambahOpen(true)} className="h-9 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white gap-1.5 px-4 text-sm">
              <Plus className="size-4" /> Tambah Bahan Baku
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-gray-200">
                {[
                  { key: "id" as SortKey, label: "No", className: "w-16 pl-6" },
                  { key: "nama" as SortKey, label: "Nama Bahan Baku", className: "w-[40%]" },
                  { key: "satuan" as SortKey, label: "Satuan", className: "w-[30%]" },
                ].map((col) => (
                  <TableHead key={col.key} className={cn("cursor-pointer select-none", col.className)} onClick={() => handleSort(col.key)}>
                    <div className="flex items-center text-gray-600 font-semibold text-sm">
                      {col.label}<SortIcon col={col.key} />
                    </div>
                  </TableHead>
                ))}
                <TableHead className="text-gray-600 font-semibold text-sm text-right pr-20">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((row) => (
                <TableRow key={row.id} className="hover:bg-gray-50/50 border-gray-100 transition-colors">
                  <TableCell className="text-gray-500 text-sm pl-6">{row.id}</TableCell>
                  <TableCell className="text-gray-800 text-sm">{row.nama}</TableCell>
                  <TableCell className="text-gray-600 text-sm">{row.satuan}</TableCell>
                  <TableCell className="text-right pr-16">
                    <button onClick={() => setEditItem(row)} className="bg-green-100 hover:bg-green-200 text-green-700 text-xs font-bold h-7 px-5 rounded-full transition-colors">
                      EDIT
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              {sorted.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-400 py-12 text-sm">Tidak ada data ditemukan.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>

      {/* Dialogs */}
      <BahanBakuFormDialog open={tambahOpen} onOpenChange={setTambahOpen} mode="tambah" />
      <BahanBakuFormDialog
        open={!!editItem}
        onOpenChange={(open) => { if (!open) setEditItem(null) }}
        mode="edit"
        initialData={editItem ? { namaBahanBaku: editItem.nama, satuan: editItem.satuan, peringatanStock: editItem.peringatanStock } : undefined}
      />
    </div>
  )
}
