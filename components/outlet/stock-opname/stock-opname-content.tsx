"use client";

import { useState } from "react";
import { Plus, Search, Loader2, Pencil, Trash2, CheckCircle, Image as ImageIcon, Save, Lock } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { 
  useSesiHariIni, 
  useHistorySesi, 
  useHapusItem, 
  useSimpanSemua, 
  useTutupSesi 
} from "@/hooks/outlet/use-stock-opname";
import { DraftOpnameModal } from "./draft-opname-modal";
import type { StockOpname } from "@/services/outlet/stock-opname-service";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

export function StockOpnameContent() {
  const [modalOpen, setModalOpen] = useState(false);
  const [draftToEdit, setDraftToEdit] = useState<StockOpname | null>(null);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const [historyPage, setHistoryPage] = useState(1);

  const { data: sesiResponse, isLoading: isLoadingSesi } = useSesiHariIni();
  const { data: historyResponse, isLoading: isLoadingHistory } = useHistorySesi(historyPage);
  
  const { mutate: deleteDraft, isPending: isDeleting } = useHapusItem();
  const { mutate: simpanSemua, isPending: isSimpanSemua } = useSimpanSemua();
  const { mutate: tutupSesi, isPending: isTutupSesi } = useTutupSesi();

  const sesiHariIni = sesiResponse?.data;
  const historyList = historyResponse?.data || [];
  const meta = historyResponse?.meta;

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
    if (confirm("Apakah Anda yakin ingin menghapus item ini?")) {
      deleteDraft(id);
    }
  };

  const handleSimpanSemua = () => {
    if (confirm("Perhatian: Finalisasi akan memotong stok bahan baku Anda secara permanen. Lanjutkan?")) {
      simpanSemua();
    }
  };

  const handleTutupSesi = () => {
    if (confirm("Apakah Anda yakin ingin menutup sesi hari ini? Anda tidak bisa menambah draft lagi setelah sesi ditutup, dan draft yang belum difinalisasi akan dihapus.")) {
      tutupSesi();
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
        <p className="text-sm text-gray-500 mt-0.5">Catat penyesuaian stok per hari. 1 Hari = 1 Sesi.</p>
      </div>

      <Tabs defaultValue="sesi" className="w-full">
        <TabsList className="grid w-[400px] grid-cols-2 mb-6">
          <TabsTrigger value="sesi">Sesi Hari Ini</TabsTrigger>
          <TabsTrigger value="history">Histori Sesi</TabsTrigger>
        </TabsList>

        <TabsContent value="sesi" className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap sm:justify-between pt-2">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Sesi Stock Opname Hari Ini</h2>
              {sesiHariIni?.status === 'closed' && (
                <p className="text-sm text-red-500 font-medium mt-1">Sesi hari ini sudah ditutup.</p>
              )}
            </div>
            
            <div className="flex gap-2">
              {sesiHariIni?.status !== 'closed' && (
                <>
                  <Button 
                    onClick={handleCreate}
                    className="h-9 rounded-lg bg-orange-600 hover:bg-orange-700 text-white gap-1.5 px-4 text-sm cursor-pointer shadow-sm"
                  >
                    <Plus className="size-4" /> 
                    Tambah Draft
                  </Button>

                  {(sesiHariIni?.items?.some(i => i.status === 'draft')) && (
                    <Button 
                      onClick={handleSimpanSemua}
                      disabled={isSimpanSemua}
                      className="h-9 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 px-4 text-sm cursor-pointer shadow-sm"
                    >
                      <Save className="size-4" /> 
                      Simpan Final
                    </Button>
                  )}

                  <Button 
                    onClick={handleTutupSesi}
                    disabled={isTutupSesi}
                    variant="outline"
                    className="h-9 rounded-lg border-gray-300 text-gray-700 hover:bg-gray-100 gap-1.5 px-4 text-sm cursor-pointer shadow-sm"
                  >
                    <Lock className="size-4" /> 
                    Tutup Sesi
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm mt-4">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-gray-200">
                  <TableHead className="w-16 text-center text-gray-600 font-semibold text-sm py-3">No</TableHead>
                  <TableHead className="text-gray-600 font-semibold text-sm py-3">Bahan Baku</TableHead>
                  <TableHead className="text-gray-600 font-semibold text-sm py-3 text-center">Tipe</TableHead>
                  <TableHead className="text-gray-600 font-semibold text-sm py-3 text-center">Jumlah</TableHead>
                  <TableHead className="text-gray-600 font-semibold text-sm py-3 text-center">Bukti</TableHead>
                  <TableHead className="text-gray-600 font-semibold text-sm py-3 text-center">Status</TableHead>
                  <TableHead className="w-24 text-center text-gray-600 font-semibold text-sm py-3">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingSesi && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-400 py-12 text-sm">
                      <Loader2 className="size-6 animate-spin text-blue-600 mx-auto" />
                    </TableCell>
                  </TableRow>
                )}
                
                {!isLoadingSesi && (!sesiHariIni || sesiHariIni.items?.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-400 py-12 text-sm">
                      Belum ada penyesuaian stok hari ini.
                    </TableCell>
                  </TableRow>
                )}

                {!isLoadingSesi && sesiHariIni?.items?.map((row, index) => (
                  <TableRow key={row.id} className="hover:bg-gray-50/50 border-gray-100 transition-colors">
                    <TableCell className="text-gray-500 text-sm text-center py-3">
                      {index + 1}
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
                    <TableCell className="text-center py-3">
                      <StatusBadge status={row.status} />
                    </TableCell>
                    <TableCell className="text-center py-3">
                      {row.status === "draft" && sesiHariIni.status !== 'closed' ? (
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleEdit(row)}
                            disabled={isDeleting || isSimpanSemua}
                            className="flex items-center justify-center size-7 bg-[#3874BC] hover:bg-[#2c5b96] text-white rounded-md transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                            title="Edit Draft"
                          >
                            <Pencil className="size-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(row.id)}
                            disabled={isDeleting || isSimpanSemua}
                            className="flex items-center justify-center size-7 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                            title="Hapus Draft"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Dikunci</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-gray-200">
                  <TableHead className="w-16 text-center text-gray-600 font-semibold text-sm py-3">No</TableHead>
                  <TableHead className="text-gray-600 font-semibold text-sm py-3">Tanggal Sesi</TableHead>
                  <TableHead className="text-gray-600 font-semibold text-sm py-3 text-center">Status</TableHead>
                  <TableHead className="text-gray-600 font-semibold text-sm py-3 text-center">Waktu Penutupan</TableHead>
                  <TableHead className="text-gray-600 font-semibold text-sm py-3 text-center">Item Draft</TableHead>
                  <TableHead className="text-gray-600 font-semibold text-sm py-3 text-center">Item Final</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingHistory && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-400 py-12 text-sm">
                      <Loader2 className="size-6 animate-spin text-blue-600 mx-auto" />
                    </TableCell>
                  </TableRow>
                )}
                
                {!isLoadingHistory && historyList.map((row, index) => {
                  const actualIndex = meta ? (meta.current_page - 1) * meta.per_page + index + 1 : index + 1;
                  return (
                    <TableRow key={row.id} className="hover:bg-gray-50/50 border-gray-100 transition-colors">
                      <TableCell className="text-gray-500 text-sm text-center py-3">
                        {actualIndex}
                      </TableCell>
                      <TableCell className="text-gray-800 text-sm font-medium py-3">
                        {new Date(row.tanggal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </TableCell>
                      <TableCell className="text-center py-3">
                        {row.status === 'closed' ? (
                           <Badge variant="outline" className="border-red-200 text-red-600 bg-red-50 rounded-full px-3 font-medium">Ditutup</Badge>
                        ) : (
                           <Badge variant="outline" className="border-emerald-200 text-emerald-600 bg-emerald-50 rounded-full px-3 font-medium">Berjalan</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-600 text-sm text-center py-3">
                        {row.closed_at ? formatDate(row.closed_at) : '-'}
                      </TableCell>
                      <TableCell className="text-gray-600 text-sm font-semibold text-center py-3">
                        {row.total_draft || 0}
                      </TableCell>
                      <TableCell className="text-gray-600 text-sm font-semibold text-center py-3">
                        {row.total_final || 0}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {!isLoadingHistory && historyList.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-400 py-12 text-sm">
                      Belum ada histori sesi stock opname.
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
                  onClick={() => setHistoryPage(p => Math.max(1, p - 1))}
                  disabled={historyPage === 1}
                  className="h-8 rounded-full px-4 text-xs font-medium cursor-pointer"
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setHistoryPage(pageNum)}
                      className={cn(
                        "size-8 rounded-full text-xs font-medium transition-colors cursor-pointer",
                        historyPage === pageNum
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
                  onClick={() => setHistoryPage(p => Math.min(meta.last_page, p + 1))}
                  disabled={historyPage === meta.last_page}
                  className="h-8 rounded-full px-4 text-xs font-medium cursor-pointer"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

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
