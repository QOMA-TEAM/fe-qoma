"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { usePesananList } from "@/hooks/outlet/use-pesanan";
import { useDebounce } from "@/hooks/use-debounce";
import { PesananDetailDialog } from "@/components/outlet/riwayat-pesanan/pesanan-detail-dialog";
import type { Pesanan } from "@/services/outlet/pesanan-service";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatRupiah } from "@/lib/utils";

export function RiwayatPesananContent() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [detailItem, setDetailItem] = useState<Pesanan | null>(null);

  const debouncedSearch = useDebounce(search, 800);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  const { data: response, isLoading, isError } = usePesananList({
    page,
    search: debouncedSearch,
    status: status,
  });

  const pesananList = response?.data || [];
  const meta = response?.meta;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string, label: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap text-center inline-block";
    
    switch (status) {
      case "pending":
        return <span className={cn(baseClasses, "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400")}>{label}</span>;
      case "confirmed":
        return <span className={cn(baseClasses, "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400")}>{label}</span>;
      case "paid":
        return <span className={cn(baseClasses, "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400")}>{label}</span>;
      case "cancelled":
      case "expired":
        return <span className={cn(baseClasses, "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400")}>{label}</span>;
      default:
        return <span className={cn(baseClasses, "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400")}>{label}</span>;
    }
  };

  const getTipeBadge = (tipe?: string) => {
    if (tipe === "dine_in") {
      return <span className="text-blue-600 dark:text-blue-400 font-medium text-xs border border-blue-200 dark:border-blue-900 px-2 py-1 rounded-full whitespace-nowrap">Dine In</span>;
    }
    if (tipe === "take_away") {
      return <span className="text-purple-600 dark:text-purple-400 font-medium text-xs border border-purple-200 dark:border-purple-900 px-2 py-1 rounded-full whitespace-nowrap">Take Away</span>;
    }
    return <span className="text-gray-500">-</span>;
  };

  return (
    <div className="p-6 space-y-6 bg-transparent">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Riwayat Pesanan</h1>
        <p className="text-sm text-gray-500 mt-0.5">Informasi detail riwayat pesanan</p>
      </div>

      <div className="flex items-center gap-2 flex-wrap sm:justify-between pt-2">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Input 
              placeholder="Search" 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="pr-9 h-9 w-44 text-sm border-gray-200 rounded-full" 
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-9 w-44 text-sm border-gray-200 rounded-full">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="pending">Menunggu Konfirmasi</SelectItem>
              <SelectItem value="confirmed">Dikonfirmasi</SelectItem>
              <SelectItem value="paid">Lunas</SelectItem>
              <SelectItem value="cancelled">Dibatalkan</SelectItem>
              <SelectItem value="expired">Kedaluwarsa</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 overflow-hidden bg-white mt-4 shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-gray-200">
                <TableHead className="w-16 text-center text-gray-600 font-semibold text-sm py-3">No</TableHead>
                <TableHead className="text-gray-600 font-semibold text-sm py-3">ID Pesanan</TableHead>
                <TableHead className="text-gray-600 font-semibold text-sm py-3">Pelanggan</TableHead>
                <TableHead className="text-gray-600 font-semibold text-sm py-3">Meja</TableHead>
                <TableHead className="text-center text-gray-600 font-semibold text-sm py-3">Tipe</TableHead>
                <TableHead className="text-center text-gray-600 font-semibold text-sm py-3">Total Harga</TableHead>
                <TableHead className="text-center text-gray-600 font-semibold text-sm py-3">Status</TableHead>
                <TableHead className="text-center text-gray-600 font-semibold text-sm py-3">Waktu</TableHead>
                <TableHead className="w-28 text-center text-gray-600 font-semibold text-sm py-3">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-gray-400 py-12 text-sm">
                    <Loader2 className="size-6 animate-spin text-blue-600 mx-auto" />
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-red-500 py-12 text-sm">
                    Gagal mengambil data dari server.
                  </TableCell>
                </TableRow>
              ) : pesananList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-gray-400 py-12 text-sm">
                    Tidak ada pesanan yang ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                pesananList.map((row, index) => {
                  const actualIndex = meta ? (meta.current_page - 1) * meta.per_page + index + 1 : index + 1;
                  return (
                    <TableRow key={row.id} className="hover:bg-gray-50/50 border-gray-100 transition-colors">
                      <TableCell className="text-gray-500 text-sm text-center py-3">{actualIndex}</TableCell>
                      <TableCell className="text-gray-800 text-sm py-3">
                        <div className="font-mono text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded inline-block">
                          {row.id.split("-")[0]}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-800 text-sm py-3">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">{row.nama_pelanggan}</span>
                          {row.no_telp && <span className="text-xs text-gray-500">{row.no_telp}</span>}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600 text-sm py-3">
                        <span className="font-medium text-gray-700">
                          {row.nomor_meja || "-"}
                        </span>
                      </TableCell>
                      <TableCell className="text-center py-3">
                        {getTipeBadge(row.tipe_pesanan)}
                      </TableCell>
                      <TableCell className="text-center text-gray-600 text-sm py-3">
                        {formatRupiah(row.total_harga)}
                      </TableCell>
                      <TableCell className="text-center py-3">
                        {getStatusBadge(row.status, row.status_label)}
                      </TableCell>
                      <TableCell className="text-center text-sm text-gray-600 py-3">
                        {formatDate(row.created_at)}
                      </TableCell>
                      <TableCell className="text-center py-3">
                        <button 
                          onClick={() => setDetailItem(row)}
                          className="bg-[#3874BC] hover:bg-[#2c5b96] text-white flex items-center justify-center w-7 h-7 rounded-full mx-auto transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
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

      {detailItem && (
        <PesananDetailDialog
          isOpen={!!detailItem} 
          onClose={() => setDetailItem(null)} 
          pesananId={detailItem.id} 
        />
      )}
    </div>
  );
}
