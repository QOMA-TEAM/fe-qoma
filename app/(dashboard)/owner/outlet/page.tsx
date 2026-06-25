"use client"

import { useState } from "react"
import { HeaderActions } from "@/components/dashboard/header-actions"
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { TambahOutletDialog } from "@/components/owner/outlet/tambah-outlet-dialog"
import { OutletControls } from "@/components/owner/outlet/outlet-controls"
import { OutletTable } from "@/components/owner/outlet/outlet-table"

export default function KelolaOutletPage() {
  const [search, setSearch] = useState("")
  const [tambahOpen, setTambahOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/40">
      {/* Top Bar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-6 shadow-sm">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <span className="text-sm text-muted-foreground">KELOLA</span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm">Outlet</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <HeaderActions />
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto p-6 space-y-6">
        {/* Title + Controls */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Kelola Outlet</h2>
          <p className="text-sm text-gray-500 mt-0.5">Informasi detail Data Tenant</p>
        </div>

        {/* Controls (Search & Add Button) */}
        <OutletControls 
          search={search} 
          setSearch={setSearch} 
          onAddClick={() => setTambahOpen(true)} 
        />

        {/* Data Table */}
        <OutletTable search={search} />
      </main>

      {/* Dialogs */}
      <TambahOutletDialog open={tambahOpen} onOpenChange={setTambahOpen} />
    </div>
  )
}
