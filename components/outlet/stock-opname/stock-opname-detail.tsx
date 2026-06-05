"use client";

import { useState } from "react";
import { Plus, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useStockOpnameDetail, useUpdateStockOpnameStatus } from "@/hooks/outlet/use-stock-opname";
import { useRouter } from "next/navigation";
import { AddItemModal } from "./add-item-modal";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function StockOpnameDetail({ id }: { id: string }) {
  const router = useRouter();
  const { data: response, isLoading, isError } = useStockOpnameDetail(id);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateStockOpnameStatus();
  
  const [addModalOpen, setAddModalOpen] = useState(false);

  const opname = response?.data;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(new Date(dateStr));
  };

  const handleUpdateStatus = (status: string) => {
    if (confirm(`Apakah Anda yakin ingin mengubah status menjadi ${status}?`)) {
      updateStatus({ id, status });
    }
  };

  if (isLoading) {
    return <div className="flex h-full items-center justify-center p-12"><Loader2 className="size-8 animate-spin text-blue-600" /></div>;
  }

  if (isError || !opname) {
    return <div className="p-6 text-red-500">Data tidak ditemukan.</div>;
  }

  const isEditable = opname.status === "pending" || opname.status === "reviewing";

  return (
    <div className="p-6 space-y-6 bg-transparent">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm font-medium text-gray-500 gap-2 mb-4">
        <Link href="/outlet/dashboard" className="hover:text-gray-900 uppercase">KELOLA</Link>
        <span>/</span>
        <Link href="/outlet/stock-opname" className="hover:text-gray-900">Stock Opname</Link>
        <span>/</span>
        <span className="text-gray-900">View</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Stock Opname</h1>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 font-medium">ID Stock Opname</p>
              <p className="text-xl font-bold text-gray-800">{opname.id.substring(0, 8).toUpperCase()}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Status</p>
              {opname.status === "pending" && <Badge variant="outline" className="border-yellow-400 text-yellow-600 bg-yellow-50 rounded-full px-4 font-medium capitalize">Pending</Badge>}
              {opname.status === "reviewing" && <Badge variant="outline" className="border-blue-400 text-blue-600 bg-blue-50 rounded-full px-4 font-medium capitalize">Reviewing</Badge>}
              {opname.status === "approved" && <Badge variant="outline" className="border-emerald-400 text-emerald-600 bg-emerald-50 rounded-full px-4 font-medium capitalize">Approved</Badge>}
            </div>

            <div>
              <p className="text-sm text-gray-500 font-medium">Date</p>
              <p className="text-sm text-gray-800 font-medium">{formatDate(opname.created_at)}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {opname.status !== "approved" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  disabled={isUpdating}
                  variant="outline" 
                  className="h-9 rounded-lg border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 gap-1.5 px-4 text-sm font-semibold shadow-sm"
                >
                  {isUpdating ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                  Update Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {opname.status === "pending" && (
                  <DropdownMenuItem onClick={() => handleUpdateStatus("reviewing")}>
                    Set to Reviewing
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => handleUpdateStatus("approved")} className="text-emerald-600 font-medium">
                  Set to Approved
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <div className="pt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Barang Stock Opname</h2>
          {isEditable && (
            <Button 
              onClick={() => setAddModalOpen(true)}
              variant="outline"
              className="h-9 rounded-lg border-blue-200 text-blue-700 bg-white hover:bg-blue-50 gap-1.5 px-4 text-sm font-semibold shadow-sm"
            >
              <Plus className="size-4" /> Tambah Barang Stock Opname
            </Button>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 hover:bg-gray-100 border-gray-200">
                <TableHead className="w-24 text-center text-gray-600 font-semibold text-sm py-3">Foto</TableHead>
                <TableHead className="text-gray-600 font-semibold text-sm py-3 text-center">Nama Bahan Baku</TableHead>
                <TableHead className="text-gray-600 font-semibold text-sm py-3 text-center">Kondisi Stock</TableHead>
                <TableHead className="text-gray-600 font-semibold text-sm py-3 text-center">Stock Ril</TableHead>
                <TableHead className="text-gray-600 font-semibold text-sm py-3 text-center">Recent Stock</TableHead>
                <TableHead className="text-gray-600 font-semibold text-sm py-3 text-center">Stock Hilang</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(!opname.items || opname.items.length === 0) ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-400 py-12 text-sm">
                    Belum ada barang yang ditambahkan.
                  </TableCell>
                </TableRow>
              ) : (
                opname.items.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50/50 border-gray-100">
                    <TableCell className="text-center py-3">
                      <div className="w-16 h-12 bg-gray-100 rounded-lg mx-auto overflow-hidden flex items-center justify-center">
                        {item.bahan_master?.gambar ? (
                          <img
                            src={item.bahan_master.gambar.startsWith('http') ? item.bahan_master.gambar : `http://localhost:8000/storage/${item.bahan_master.gambar}`}
                            alt={item.bahan_master.nama}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[10px] text-gray-400">No Img</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-800 text-sm font-medium text-center py-3">
                      {item.bahan_master?.nama || "-"}
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm capitalize text-center py-3">
                      {item.kondisi_stock.replace("_", " ")}
                    </TableCell>
                    <TableCell className="text-gray-800 text-sm font-semibold text-center py-3">
                      {item.stock_ril}
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm text-center py-3">
                      {item.recent_stock}
                    </TableCell>
                    <TableCell className="text-red-600 text-sm font-semibold text-center py-3">
                      {item.stock_hilang}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AddItemModal 
        open={addModalOpen} 
        onOpenChange={setAddModalOpen} 
        opnameId={id} 
      />
    </div>
  );
}
