"use client"

import { useState } from "react"
import { Search, Loader2, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { cn, formatDeskripsi } from "@/lib/utils"
import { useOwnerActivityLogList } from "@/hooks/owner/use-activity-log"
import { useOutlets } from "@/hooks/owner/use-outlets"
import { useDebounce } from "@/hooks/use-debounce"

export function ActivityLogContent() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [outletId, setOutletId] = useState<string>("owner")
  
  const debouncedSearch = useDebounce(search, 300)
  
  const { data: outletsResponse } = useOutlets()
  const outlets = outletsResponse?.data || []

  const { data: listResponse, isLoading, isError } = useOwnerActivityLogList(page, debouncedSearch, undefined, undefined, undefined, outletId)
  
  const logs = listResponse?.data || []
  const meta = listResponse?.meta

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {/* Dropdown Filter Outlet */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-1.5 text-sm text-white hover:text-white h-9 rounded-full px-4 bg-orange-600 focus:bg-orange-600 focus:text-white data-[state=open]:bg-orange-600 data-[state=open]:text-white cursor-pointer border-0 ring-0 focus-visible:ring-0 shadow-sm">
                {outletId === "" ? "Semua Aktivitas" : 
                 outletId === "owner" ? "Owner" :
                 outlets.find((o) => o.id === outletId)?.nama_outlet || "Pilih Outlet"}{" "}
                <ChevronDown className="w-3.5 h-3.5 text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 max-h-60 overflow-y-auto">
              <DropdownMenuItem
                onClick={() => {
                  setOutletId("");
                  setPage(1);
                }}
                className={cn("cursor-pointer", outletId === "" && "font-medium text-blue-600")}
              >
                Semua Aktivitas
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setOutletId("owner");
                  setPage(1);
                }}
                className={cn("cursor-pointer", outletId === "owner" && "font-medium text-blue-600")}
              >
                Owner
              </DropdownMenuItem>
              {outlets.map((outlet) => (
                <DropdownMenuItem
                  key={outlet.id}
                  onClick={() => {
                    setOutletId(outlet.id);
                    setPage(1);
                  }}
                  className={cn(
                    "cursor-pointer",
                    outletId === outlet.id && "font-medium text-blue-600"
                  )}
                >
                  {outlet.nama_outlet}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="relative">
            <Input
              placeholder="Cari aktivitas..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pr-9 h-9 w-64 text-sm border-gray-200 rounded-full bg-white shadow-sm"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100 hover:bg-gray-100 border-gray-200">
              <TableHead className="w-40 text-gray-600 font-semibold text-sm">Waktu</TableHead>
              <TableHead className="w-48 text-gray-600 font-semibold text-sm">User</TableHead>
              <TableHead className="w-48 text-gray-600 font-semibold text-sm">Aktivitas</TableHead>
              <TableHead className="text-gray-600 font-semibold text-sm">Deskripsi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-48 text-center">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto" />
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={4} className="h-48 text-center">
                  <div className="text-red-500 font-medium text-sm">Gagal memuat data activity log.</div>
                </TableCell>
              </TableRow>
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-400 py-12 text-sm">Tidak ada aktivitas ditemukan.</TableCell>
              </TableRow>
            ) : (
              logs.map((row) => (
                <TableRow key={row.id} className="hover:bg-gray-50/50 border-gray-100 transition-colors">
                  <TableCell className="text-gray-600 text-sm whitespace-nowrap py-3">{row.created_at}</TableCell>
                  <TableCell className="text-gray-800 text-sm font-medium py-3">{row.user?.nama_lengkap || row.user?.username || "-"}</TableCell>
                  <TableCell className="py-3">
                    <span className="text-sm text-gray-800 capitalize font-medium">{row.aktivitas.replace(/_/g, " ")}</span>
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm py-3" title={row.deskripsi}>{formatDeskripsi(row.deskripsi)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {meta && meta.total > 0 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-gray-500">
            Menampilkan Halaman <span className="font-medium text-gray-900">{meta.current_page}</span> dari <span className="font-medium text-gray-900">{meta.last_page}</span> halaman
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-8 rounded-full px-4 text-xs font-medium cursor-pointer"
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((pageNum) => {
                if (
                  pageNum === 1 ||
                  pageNum === meta.last_page ||
                  (pageNum >= page - 1 && pageNum <= page + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={cn(
                        "size-8 rounded-full text-xs font-medium transition-colors cursor-pointer",
                        page === pageNum
                          ? "bg-[#1D5E84] hover:bg-[#154663] text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                }
                if (pageNum === page - 2 || pageNum === page + 2) {
                  return <span key={pageNum} className="text-gray-400 px-1">...</span>;
                }
                return null;
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
              disabled={page === meta.last_page}
              className="h-8 rounded-full px-4 text-xs font-medium cursor-pointer"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
