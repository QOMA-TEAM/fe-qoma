"use client"

import { Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface BahanBakuControlsProps {
  search: string
  setSearch: (value: string) => void
  onAddClick: () => void
}

export function BahanBakuControls({ search, setSearch, onAddClick }: BahanBakuControlsProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap sm:justify-between pt-2">
      <div className="relative">
        <Input 
          placeholder="Search" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="pr-9 h-9 w-44 text-sm border-gray-200 rounded-full" 
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      </div>
      <Button 
        onClick={onAddClick} 
        className="h-9 rounded-lg bg-orange-600 hover:bg-orange-700 text-white gap-1.5 px-4 text-sm cursor-pointer"
      >
        <Plus className="size-4" /> Tambah Bahan Baku
      </Button>
    </div>
  )
}
