"use client"

import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const rangeLabels: Record<string, string> = {
  "1day": "Hari Ini",
  "7days": "7 Hari Terakhir",
  "30days": "30 Hari Terakhir",
}

const tipeLabels: Record<string, string> = {
  "semua": "Semua Tipe",
  "pendapatan": "Pendapatan",
  "pengeluaran": "Pengeluaran",
  "kerugian": "Kerugian",
}

interface Props {
  range: string
  setRange: (v: string) => void
  tipe: string
  setTipe: (v: string) => void
}

export function DetailKeuanganFilter({ range, setRange, tipe, setTipe }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="gap-1.5 text-sm border-gray-200 text-gray-700 h-9 rounded-full px-4 bg-white cursor-pointer"
          >
            {rangeLabels[range]} <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-44">
          {Object.entries(rangeLabels).map(([key, label]) => (
            <DropdownMenuItem
              key={key}
              onClick={() => setRange(key)}
              className={cn("cursor-pointer", range === key && "font-medium text-blue-600")}
            >
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="gap-1.5 text-sm border-gray-200 text-gray-700 h-9 rounded-full px-4 bg-white cursor-pointer"
          >
            {tipeLabels[tipe]} <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-44">
          {Object.entries(tipeLabels).map(([key, label]) => (
            <DropdownMenuItem
              key={key}
              onClick={() => setTipe(key)}
              className={cn("cursor-pointer", tipe === key && "font-medium text-blue-600")}
            >
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
