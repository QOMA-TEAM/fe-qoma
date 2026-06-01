"use client"

import { useState } from "react"
import { HeaderActions } from "@/components/dashboard/header-actions"
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { KategoriFormDialog } from "@/components/kategori/kategori-form-dialog"
import { KategoriControls } from "@/components/owner/kategori/kategori-controls"
import { KategoriTable } from "@/components/owner/kategori/kategori-table"

export default function KelolaKategoriPage() {
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
            <BreadcrumbItem><BreadcrumbPage className="text-sm">Kategori</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <HeaderActions />
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto p-6 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Kelola Kategori</h2>
            <p className="text-sm text-gray-500 mt-0.5">Informasi detail kategori menu</p>
          </div>
        </div>
        
        {/* Controls */}
        <KategoriControls 
          search={search}
          setSearch={setSearch}
          onAddClick={() => setTambahOpen(true)}
        />

        {/* Table */}
        <KategoriTable search={search} />
      </main>

      {/* Dialog Tambah */}
      <KategoriFormDialog open={tambahOpen} onOpenChange={setTambahOpen} mode="tambah" />
    </div>
  )
}
