"use client";

import { useState } from "react";
import { Plus, Search, Loader2, Edit, Trash2, CheckCircle, Image as ImageIcon } from "lucide-react";
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
import { useStockOpnameList, useDeleteDraftOpname, useFinalizeDraftOpname } from "@/hooks/outlet/use-stock-opname";
import { DraftOpnameModal } from "./draft-opname-modal";
import type { StockOpname } from "@/services/outlet/stock-opname-service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function StockOpnameContent() {
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [draftToEdit, setDraftToEdit] = useState<StockOpname | null>(null);
  
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const { data: response, isLoading, isError } = useStockOpnameList(page);
  const { mutate: deleteDraft, isPending: isDeleting } = useDeleteDraftOpname();
  const { mutate: finalizeDraft, isPending: isFinalizing } = useFinalizeDraftOpname();

  const opnameList = response?.data || [];
  const meta = response?.meta;

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateStr));
  };

  const formatTipe = (tipe: string) => {
    switch (tipe) {
      case "busuk": return "Busuk";
      case "rusak": return "Rusak";
      case "ga_layak": return "Tidak Layak";
      case "hilang": return "Hilang";
      default: return tipe;
    }
  };

  const handleCreate = () => {
    setDraftToEdit(null);
    setModalOpen(true);
  };

  const handleEdit = (draft: StockOpname) => {
    setDraftToEdit(draft);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus draft ini?")) {
      deleteDraft(id);
    }
  };

  const handleFinalize = (id: string) => {
    if (confirm("Perhatian: Finalisasi akan memotong stok bahan baku Anda. Apakah Anda yakin?")) {
      finalizeDraft(id);
    }
  };

  const handleViewPhoto = (url: string) => {
    setSelectedPhoto(url);
    setPhotoModalOpen(true);
  };

  const StatusBadge = ({ status }: { status: string }) => {
    if (status === "draft") {
      return <Badge variant="outline" className="border-yellow-400 text-yellow-600 bg-yellow-50 rounded-full px-3 font-medium capitalize">Draft</Badge>;
    }
    if (status === "final") {
      return <Badge variant="outline" className="border-emerald-400 text-emerald-600 bg-emerald-50 rounded-full px-3 font-medium capitalize">Final</Badge>;
    }
    return <Badge>{status}</Badge>;
  };

  return (
    <div className="p-6 space-y-6 bg-transparent">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Kelola Stock Opname</h1>
        <p className="text-sm text-gray-500 mt-0.5">Catat barang hilang, rusak, atau busuk untuk menyesuaikan stok</p>
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
          className="h-9 rounded-lg bg-orange-600 hover:bg-orange-700 text-white gap-1.5 px-4 text-sm cursor-pointer shadow-sm"
        >
          <Plus className="size-4" /> 
          Tambah Draft Penyesuaian
        </Button>
      </div>

      <div className="rounded-xl border border-gray-200 overflow-hidden bg-white mt-4 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-gray-200">
              <TableHead className="w-16 text-center text-gray-600 font-semibold text-sm py-3">No</TableHead>
              <TableHead className="text-gray-600 font-semibold text-sm py-3">Bahan Baku</TableHead>
              <TableHead className="text-gray-600 font-semibold text-sm py-3 text-center">Tipe Penyesuaian</TableHead>
              <TableHead className="text-gray-600 font-semibold text-sm py-3 text-center">Jumlah</TableHead>
              <TableHead className="text-gray-600 font-semibold text-sm py-3 text-center">Bukti</TableHead>
              <TableHead className="text-gray-600 font-semibold text-sm py-3 text-center">Tanggal</TableHead>
              <TableHead className="text-gray-600 font-semibold text-sm py-3 text-center">Status</TableHead>
              <TableHead className="w-36 text-center text-gray-600 font-semibold text-sm py-3">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-gray-400 py-12 text-sm">
                  <Loader2 className="size-6 animate-spin text-blue-600 mx-auto" />
                </TableCell>
              </TableRow>
            )}
            {isError && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-red-500 py-12 text-sm">
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
                    <div className="flex flex-col">
                      <span>{row.bahan_master?.nama || "Unknown"}</span>
                      {row.keterangan && <span className="text-xs text-gray-500 line-clamp-1">{row.keterangan}</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm text-center py-3">
                    {formatTipe(row.tipe)}
                  </TableCell>
                  <TableCell className="text-red-600 text-sm font-semibold text-center py-3">
                    - {row.jumlah} {row.bahan_master?.satuan || ""}
                  </TableCell>
                  <TableCell className="text-center py-3">
                    {row.foto_bukti ? (
                      <button 
                        onClick={() => handleViewPhoto(row.foto_bukti!)}
                        className="text-blue-500 hover:text-blue-700 flex items-center justify-center w-full"
                        title="Lihat Foto Bukti"
                      >
                        <ImageIcon className="w-5 h-5" />
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-600 text-xs text-center py-3 whitespace-nowrap">
                    {formatDate(row.created_at)}
                  </TableCell>
                  <TableCell className="text-center py-3">
                    <StatusBadge status={row.status} />
                  </TableCell>
                  <TableCell className="text-center py-3">
                    {row.status === "draft" ? (
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleFinalize(row.id)}
                          disabled={isFinalizing || isDeleting}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center w-7 h-7 rounded-md mx-auto transition-colors cursor-pointer disabled:opacity-50"
                          title="Finalisasi (Potong Stok)"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEdit(row)}
                          disabled={isFinalizing || isDeleting}
                          className="bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center w-7 h-7 rounded-md mx-auto transition-colors cursor-pointer disabled:opacity-50"
                          title="Edit Draft"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(row.id)}
                          disabled={isFinalizing || isDeleting}
                          className="bg-red-500 hover:bg-red-600 text-white flex items-center justify-center w-7 h-7 rounded-md mx-auto transition-colors cursor-pointer disabled:opacity-50"
                          title="Hapus Draft"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Selesai</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {!isLoading && !isError && opnameList.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-gray-400 py-12 text-sm">
                  Tidak ada catatan penyesuaian stok.
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
            Menampilkan Halaman <span className="font-medium text-gray-900">{meta.current_page}</span> dari <span className="font-medium text-gray-900">{meta.last_page}</span>
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

      <DraftOpnameModal 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
        draftToEdit={draftToEdit}
      />

      <Dialog open={photoModalOpen} onOpenChange={setPhotoModalOpen}>
        <DialogContent className="max-w-md bg-transparent border-0 p-0 shadow-none">
          {selectedPhoto && (
            <img 
              src={selectedPhoto.startsWith('http') ? selectedPhoto : `http://localhost:8000/storage/${selectedPhoto}`} 
              alt="Bukti Foto" 
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg" 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
