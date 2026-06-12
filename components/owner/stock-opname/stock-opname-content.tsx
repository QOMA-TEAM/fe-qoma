"use client";

import { useState } from "react";
import { Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useOutlets } from "@/hooks/owner/use-outlets";
import { useOwnerStockOpnameHistory } from "@/hooks/owner/use-stock-opname";

export function StockOpnameContent() {
  const [page, setPage] = useState(1);
  const [outletId, setOutletId] = useState<string>("");

  const { data: outletsResponse } = useOutlets();
  const outlets = outletsResponse?.data || [];

  const { data: historyResponse, isLoading } = useOwnerStockOpnameHistory(page, outletId);
  const historyList = historyResponse?.data || [];
  const meta = historyResponse?.meta;

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(dateStr));
  };

  const formatTime = (dateStr: string) => {
    return new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateStr));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Filter Dropdown */}
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="gap-1.5 text-sm text-white hover:text-white h-9 rounded-full px-4 bg-orange-600 focus:bg-orange-600 focus:text-white data-[state=open]:bg-orange-600 data-[state=open]:text-white cursor-pointer border-0 ring-0 focus-visible:ring-0 shadow-sm">
              {outletId
                ? outlets.find((o) => o.id === outletId)?.nama_outlet
                : "Semua Outlet"}{" "}
              <ChevronDown className="w-3.5 h-3.5 text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 max-h-60 overflow-y-auto">
            <DropdownMenuItem
              onClick={() => {
                setOutletId("");
                setPage(1);
              }}
              className={cn("cursor-pointer", !outletId && "font-medium text-blue-600")}
            >
              Semua Outlet
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
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100 hover:bg-gray-100 border-gray-200">
              <TableHead className="w-16 text-gray-600 font-semibold text-sm text-center">
                No
              </TableHead>
              <TableHead className="text-gray-600 font-semibold text-sm">Outlet</TableHead>
              <TableHead className="text-gray-600 font-semibold text-sm">
                Tanggal Sesi
              </TableHead>
              <TableHead className="text-gray-600 font-semibold text-sm text-center">
                Status
              </TableHead>
              <TableHead className="text-gray-600 font-semibold text-sm text-center">
                Waktu Penutupan
              </TableHead>
              <TableHead className="text-gray-600 font-semibold text-sm text-center">
                Item Draft
              </TableHead>
              <TableHead className="text-gray-600 font-semibold text-sm text-center">
                Item Final
              </TableHead>
              <TableHead className="text-gray-600 font-semibold text-sm text-center">
                Total Kerugian
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-48 text-center">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto" />
                </TableCell>
              </TableRow>
            ) : historyList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-gray-400 py-12 text-sm">
                  Belum ada histori sesi stock opname.
                </TableCell>
              </TableRow>
            ) : (
              historyList.map((row, index) => {
                const outletName = outlets.find((o) => o.id === row.outlet_id)?.nama_outlet || "Unknown Outlet";
                return (
                  <TableRow
                    key={row.id}
                    className="hover:bg-gray-50/50 border-gray-100 transition-colors"
                  >
                    <TableCell className="text-gray-600 text-sm text-center py-3">
                      {(meta?.current_page ? (meta.current_page - 1) * meta.per_page : 0) +
                        index +
                        1}
                    </TableCell>
                    <TableCell className="text-gray-800 text-sm font-medium py-3">
                      {outletName}
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm py-3">
                      {formatDate(row.tanggal)}
                    </TableCell>
                    <TableCell className="text-center py-3">
                      {row.status === 'closed' ? (
                         <Badge variant="outline" className="border-red-200 text-red-600 bg-red-50 rounded-full px-3 font-medium">Ditutup</Badge>
                      ) : (
                         <Badge variant="outline" className="border-emerald-200 text-emerald-600 bg-emerald-50 rounded-full px-3 font-medium">Berjalan</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm text-center py-3">
                      {row.closed_at ? formatTime(row.closed_at) : "-"}
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm font-semibold text-center py-3">
                      {row.total_draft || 0}
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm font-semibold text-center py-3">
                      {row.total_final || 0}
                    </TableCell>
                    <TableCell className="text-red-600 text-sm font-semibold text-center py-3">
                      Rp {new Intl.NumberFormat("id-ID").format(row.total_kerugian || 0)}
                    </TableCell>
                  </TableRow>
                );
              })
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
              {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={cn(
                    "size-8 rounded-full text-xs font-medium transition-colors",
                    page === pageNum
                      ? "bg-[#1D5E84] hover:bg-[#154663] text-white"
                      : "text-gray-600 hover:bg-gray-100 cursor-pointer"
                  )}
                >
                  {pageNum}
                </button>
              ))}
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
  );
}
