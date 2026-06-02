"use client"

import { useState } from "react"
import { HeaderActions } from "@/components/dashboard/header-actions"
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { BahanBakuFormDialog } from "@/components/owner/bahan-baku/bahan-baku-form-dialog"
import { BahanBakuControls } from "@/components/owner/bahan-baku/bahan-baku-controls"
import { BahanBakuTable } from "@/components/owner/bahan-baku/bahan-baku-table"

export default function KelolaBahanBakuPage() {
  const [search, setSearch] = useState("")
  const [tambahOpen, setTambahOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/40">
      {/* Top Bar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-6 shadow-sm">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><span className="text-sm text-muted-foreground">KELOLA</span></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage className="text-sm">Bahan Baku</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <HeaderActions />
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Kelola Bahan Baku</h2>
          <p className="text-sm text-gray-500 mt-0.5">Informasi detail bahan baku</p>
        </div>
        
        {/* Controls */}
        <BahanBakuControls 
          search={search}
          setSearch={setSearch}
          onAddClick={() => setTambahOpen(true)}
        />

        {/* Table */}
        <BahanBakuTable search={search} />
      </main>

      {/* Dialog Tambah */}
      <BahanBakuFormDialog open={tambahOpen} onOpenChange={setTambahOpen} mode="tambah" />
    </div>
  )
}
