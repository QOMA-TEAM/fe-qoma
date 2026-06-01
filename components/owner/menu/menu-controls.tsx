"use client"

import { Search, Plus, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useKategori } from "@/hooks/owner/use-kategori"

interface MenuControlsProps {
  search: string
  setSearch: (value: string) => void
  selectedCategory: string
  setSelectedCategory: (value: string) => void
  setSelectedCategoryId: (value: string) => void
  setPage: (value: number) => void
  onAddClick: () => void
}

export function MenuControls({
  search, setSearch,
  selectedCategory, setSelectedCategory,
  setSelectedCategoryId, setPage,
  onAddClick
}: MenuControlsProps) {
  const { data: kategoriResponse } = useKategori(1, "", 1000)
  const categories = kategoriResponse?.data || []

  return (
    <div className="flex items-center gap-2 flex-wrap sm:justify-between">
      {/* Categories Dropdown & Search */}
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-1.5 text-sm border-gray-200 text-gray-700 h-9 rounded-full px-4 cursor-pointer">
              {selectedCategory === "Semua Kategori" ? "Kategori" : selectedCategory} <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 max-h-[300px] overflow-y-auto">
            <DropdownMenuItem 
              onClick={() => { setSelectedCategory("Semua Kategori"); setSelectedCategoryId(""); setPage(1); }} 
              className={cn("cursor-pointer", selectedCategory === "Semua Kategori" && "font-medium text-blue-600")}
            >
              Semua Kategori
            </DropdownMenuItem>
            {categories.map((cat) => (
              <DropdownMenuItem 
                key={cat.id} 
                onClick={() => { setSelectedCategory(cat.nama); setSelectedCategoryId(cat.id); setPage(1); }} 
                className={cn("cursor-pointer", selectedCategory === cat.nama && "font-medium text-blue-600")}
              >
                {cat.nama}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
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
      <Button onClick={onAddClick} className="h-9 rounded-lg bg-orange-600 hover:bg-orange-700 text-white gap-1.5 px-4 text-sm cursor-pointer">
        <Plus className="size-4" /> Tambah Menu
      </Button>
    </div>
  )
}
