"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"

import { HeaderActions } from "@/components/dashboard/header-actions"
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useAddons } from "@/hooks/owner/use-addon"
import { AddonTable } from "@/components/owner/addon/addon-table"
import { AddonControls } from "@/components/owner/addon/addon-controls"
import { AddonFormDialog } from "@/components/owner/addon/addon-form-dialog"
import { Addon } from "@/services/owner/addon"

export default function AddonPage() {
  const [page, setPage] = React.useState(1)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [selectedAddon, setSelectedAddon] = React.useState<Addon | null>(null)

  // Using simple client-side search approach but with paginated data 
  // (In a real app, you'd pass searchTerm to the hook if API supported it)
  const { data: response, isLoading } = useAddons(page, 100)
  
  const filteredData = React.useMemo(() => {
    if (!response?.data) return []
    if (!searchTerm) return response.data
    return response.data.filter(item => 
      item.nama.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [response?.data, searchTerm])

  const handleCreate = () => {
    setSelectedAddon(null)
    setIsFormOpen(true)
  }

  const handleEdit = (addon: Addon) => {
    setSelectedAddon(addon)
    setIsFormOpen(true)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/40">
      {/* Top Header Bar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-6 shadow-sm">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><span className="text-sm text-muted-foreground">KELOLA</span></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage className="text-sm">Add On</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <HeaderActions />
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto p-6 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Kelola Add On</h2>
            <p className="text-sm text-gray-500 mt-0.5">Informasi detail tambahan pilihan menu</p>
          </div>
        </div>

        {/* Controls */}
        <AddonControls 
          search={searchTerm}
          setSearch={setSearchTerm}
          setPage={setPage}
          onAddClick={handleCreate}
        />

        {/* Table Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-gray-200 mt-4">
            <Loader2 className="size-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <AddonTable 
            data={filteredData} 
            onEdit={handleEdit}
            meta={response?.meta}
            page={page}
            setPage={setPage}
          />
        )}
      </main>

      {/* Form Dialog */}
      <AddonFormDialog 
        open={isFormOpen} 
        onOpenChange={(open) => {
          if (!open) setSelectedAddon(null)
          setIsFormOpen(open)
        }} 
        mode={selectedAddon ? "edit" : "tambah"}
        initialData={selectedAddon}
      />
    </div>
  )
}
