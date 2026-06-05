"use client";

import { useState } from "react";
import { Plus, Search, Loader2, Eye } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useStockOpnameList, useCreateStockOpname } from "@/hooks/outlet/use-stock-opname";
import { useRouter } from "next/navigation";

export function StockOpnameContent() {
  const [page, setPage] = useState(1);
  const router = useRouter();

  const { data: response, isLoading, isError } = useStockOpnameList(page);
  const { mutate: createOpname, isPending: isCreating } = useCreateStockOpname();

  const opnameList = response?.data || [];
  const meta = response?.meta;

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(new Date(dateStr));
  };

  const handleCreate = () => {
    createOpname(undefined, {
      onSuccess: (data) => {
        router.push(`/outlet/stock-opname/${data.data.id}`);
      }
    });
  };

  const StatusBadge = ({ status }: { status: string }) => {
    if (status === "pending") {
      return <Badge variant="outline" className="border-yellow-400 text-yellow-600 bg-yellow-50 rounded-full px-4 font-medium capitalize">Pending</Badge>;
    }
    if (status === "reviewing") {
      return <Badge variant="outline" className="border-blue-400 text-blue-600 bg-blue-50 rounded-full px-4 font-medium capitalize">Reviewing</Badge>;
    }
    if (status === "approved") {
      return <Badge variant="outline" className="border-emerald-400 text-emerald-600 bg-emerald-50 rounded-full px-4 font-medium capitalize">Approved</Badge>;
    }
    return <Badge>{status}</Badge>;
  };

  return (
    <div className="p-6 space-y-6 bg-transparent">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Kelola Stock Opname</h1>
        <p className="text-sm text-gray-500 mt-0.5">Catatan pemeriksaan dan penyesuaian stok</p>
      </div>

      <div className="flex items-center gap-2 flex-wrap sm:justify-between pt-2">
        <div className="relative">
          <Input 
            placeholder="Search..." 
            className="pr-9 h-9 w-44 text-sm border-gray-200 rounded-full" 
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
        <Button 
          onClick={handleCreate}
          disabled={isCreating}
          className="h-9 rounded-lg bg-orange-600 hover:bg-orange-700 text-white gap-1.5 px-4 text-sm cursor-pointer shadow-sm"
        >
          {isCreating ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />} 
          Tambah Stock Opname
        </Button>
      </div>

      <div className="rounded-xl border border-gray-200 overflow-hidden bg-white mt-4 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-gray-200">
              <TableHead className="w-16 text-center text-gray-600 font-semibold text-sm py-3">No</TableHead>
              <TableHead className="text-gray-600 font-semibold text-sm py-3">ID Stock Opname</TableHead>
              <TableHead className="text-gray-600 font-semibold text-sm py-3 text-center">Date</TableHead>
              <TableHead className="text-gray-600 font-semibold text-sm py-3 text-center">Status</TableHead>
              <TableHead className="text-gray-600 font-semibold text-sm py-3 text-center">Total Bahan Baku</TableHead>
              <TableHead className="w-28 text-center text-gray-600 font-semibold text-sm py-3">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-400 py-12 text-sm">
                  <Loader2 className="size-6 animate-spin text-blue-600 mx-auto" />
                </TableCell>
              </TableRow>
            )}
            {isError && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-red-500 py-12 text-sm">
                  Gagal mengambil data dari server.
                </TableCell>
              </TableRow>
            )}
            {!isLoading && !isError && opnameList.map((row, index) => {
              const actualIndex = meta ? (meta.current_page - 1) * meta.per_page + index + 1 : index + 1;
              return (
                <TableRow key={row.id} className="hover:bg-gray-50/50 border-gray-100 transition-colors">
                  <TableCell className="text-gray-500 text-sm text-center py-3">
                    {actualIndex}
                  </TableCell>
                  <TableCell className="text-gray-800 text-sm font-medium py-3">
                    {row.id.substring(0, 8).toUpperCase()}
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm text-center py-3">
                    {formatDate(row.created_at)}
                  </TableCell>
                  <TableCell className="text-center py-3">
                    <StatusBadge status={row.status} />
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm text-center py-3">
                    {row.items_count || 0}
                  </TableCell>
                  <TableCell className="text-center py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => router.push(`/outlet/stock-opname/${row.id}`)}
                        className="bg-[#3874BC] hover:bg-[#2c5b96] text-white flex items-center justify-center w-7 h-7 rounded-full mx-auto transition-colors cursor-pointer"
                        title="View Detail"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {!isLoading && !isError && opnameList.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-400 py-12 text-sm">
                  Tidak ada data Stock Opname ditemukan.
                </TableCell>
              </TableRow>
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
                    "size-8 rounded-full text-xs font-medium transition-colors cursor-pointer",
                    page === pageNum
                      ? "bg-[#1D5E84] hover:bg-[#154663] text-white"
                      : "text-gray-600 hover:bg-gray-100"
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
