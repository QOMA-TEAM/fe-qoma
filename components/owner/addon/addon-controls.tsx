"use client"

import { Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AddonControlsProps {
  search: string
  setSearch: (value: string) => void
  setPage: (value: number) => void
  onAddClick: () => void
}

export function AddonControls({ search, setSearch, setPage, onAddClick }: AddonControlsProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap sm:justify-between">
      <div className="flex gap-2">
        <div className="relative">
          <Input 
            placeholder="Search" 
            value={search} 
            onChange={(e) => { setSearch(e.target.value); setPage(1); }} 
            className="pr-9 h-9 w-44 text-sm border-gray-200 rounded-full bg-white" 
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>
      <Button onClick={onAddClick} className="h-9 rounded-lg bg-[#EA580C] hover:bg-[#c2410c] text-white gap-1.5 px-4 text-sm cursor-pointer">
        <Plus className="size-4" /> Tambah Add On
      </Button>
    </div>
  )
}
