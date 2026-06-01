"use client"

import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useOutlets } from "@/hooks/owner/use-outlets"

const rangeLabels: Record<string, string> = {
  "1day": "Hari Ini",
  "7days": "7 Hari Terakhir",
  "30days": "30 Hari Terakhir"
}

const tipeLabels: Record<string, string> = {
  "semua": "Semua Tipe",
  "pendapatan": "Pendapatan",
  "pengeluaran": "Pengeluaran",
  "kerugian": "Kerugian"
}

interface KeuanganFilterControlsProps {
  range: string
  setRange: (range: string) => void
  tipe: string
  setTipe: (tipe: string) => void
  outletId: string
  setOutletId: (outletId: string) => void
  setPage: (page: number) => void
}

export function KeuanganFilterControls({
  range, setRange, tipe, setTipe, outletId, setOutletId, setPage
}: KeuanganFilterControlsProps) {
  const { data: outletsResponse } = useOutlets()
  const outlets = outletsResponse?.data || []

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-1.5 text-sm border-gray-200 text-gray-700 h-9 rounded-full px-4 bg-white">
              {rangeLabels[range]} <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            {Object.entries(rangeLabels).map(([key, label]) => (
              <DropdownMenuItem key={key} onClick={() => { setRange(key); setPage(1); }} className={cn("cursor-pointer", range === key && "font-medium text-blue-600")}>
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-1.5 text-sm border-gray-200 text-gray-700 h-9 rounded-full px-4 bg-white cursor-pointer">
              {tipeLabels[tipe]} <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            {Object.entries(tipeLabels).map(([key, label]) => (
              <DropdownMenuItem key={key} onClick={() => { setTipe(key); setPage(1); }} className={cn("cursor-pointer", tipe === key && "font-medium text-blue-600")}>
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex gap-2 w-full sm:w-auto">
         <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="gap-1.5 text-sm text-white hover:text-white h-9 rounded-full px-4 bg-orange-600 focus:bg-orange-600 focus:text-white data-[state=open]:bg-orange-600 data-[state=open]:text-white cursor-pointer border-0 ring-0 focus-visible:ring-0">
              {outletId ? outlets.find(o => o.id === outletId)?.nama_outlet : "Semua Outlet"} <ChevronDown className="w-3.5 h-3.5 text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 max-h-60 overflow-y-auto">
            <DropdownMenuItem onClick={() => { setOutletId(""); setPage(1); }} className={cn("cursor-pointer", !outletId && "font-medium text-blue-600")}>
              Semua Outlet
            </DropdownMenuItem>
            {outlets.map((outlet) => (
              <DropdownMenuItem key={outlet.id} onClick={() => { setOutletId(outlet.id); setPage(1); }} className={cn("cursor-pointer", outletId === outlet.id && "font-medium text-blue-600")}>
                {outlet.nama_outlet}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
