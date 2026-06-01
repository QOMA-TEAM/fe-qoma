"use client"

import { useState } from "react"
import { HeaderActions } from "@/components/dashboard/header-actions"
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { MenuFormDialog } from "@/components/owner/menu/menu-form-dialog"
import { MenuControls } from "@/components/owner/menu/menu-controls"
import { MenuTable } from "@/components/owner/menu/menu-table"

export default function KelolaMenuPage() {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua Kategori")
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("")
  const [tambahOpen, setTambahOpen] = useState(false)

  // This simple wrapper component holds the state needed by both Controls and Table,
  // and renders them cleanly.

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/40">
      {/* Top Bar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-6 shadow-sm">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><span className="text-sm text-muted-foreground">KELOLA</span></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage className="text-sm">Menu</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <HeaderActions />
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto p-6 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Kelola Menu</h2>
            <p className="text-sm text-gray-500 mt-0.5">Informasi detail menu dan resep</p>
          </div>
        </div>
        
        {/* Controls */}
        <MenuControls 
          search={search}
          setSearch={setSearch}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setSelectedCategoryId={setSelectedCategoryId}
          setPage={() => {}} // Not needed in Controls directly since Table handles page, but we clear it via key or state
          onAddClick={() => setTambahOpen(true)}
        />

        {/* Table */}
        <MenuTable 
          search={search}
          selectedCategoryId={selectedCategoryId}
        />
      </main>

      {/* Dialog Tambah */}
      <MenuFormDialog open={tambahOpen} onOpenChange={setTambahOpen} mode="tambah" />
    </div>
  )
}
