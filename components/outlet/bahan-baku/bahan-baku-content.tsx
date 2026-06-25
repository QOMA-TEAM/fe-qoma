"use client";

import { useState, useMemo, useEffect } from "react";
import { Plus, Search, Loader2, ChevronUp, ChevronDown, ChevronsUpDown, Eye } from "lucide-react";
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
import { useBahanBakuList } from "@/hooks/outlet/use-bahan-baku";
import { useDebounce } from "@/hooks/use-debounce";

type SortKey = "id" | "nama" | "stok" | "satuan" | "tanggal_masuk" | "tanggal_kadaluarsa";
type SortDir = "asc" | "desc";

import { RestockModal } from "@/components/outlet/bahan-baku/restock-modal";
import { DetailBahanBakuDialog } from "@/components/outlet/bahan-baku/detail-bahan-baku-dialog";
import type { BahanOutlet } from "@/services/outlet/bahan-baku-service";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function BahanBakuContent() {
  const [search, setSearch] = useState("");
  const [satuan, setSatuan] = useState("all");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("tanggal_kadaluarsa");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [restockOpen, setRestockOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<BahanOutlet | null>(null);

  const debouncedSearch = useDebounce(search, 800);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, satuan]);

  const { data: response, isLoading, isError } = useBahanBakuList(page, debouncedSearch, satuan);
  const bahanList = response?.data || [];
  const meta = response?.meta;

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((p) => (p === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const flatBahanList = useMemo(() => {
    let flattened: any[] = [];
    
    bahanList.forEach((bahan) => {
      const validBatches = bahan.batch_aktif?.filter((b: any) => !b.sudah_expired) || [];
      
      if (validBatches.length > 0) {
        validBatches.forEach((batch: any) => {
          flattened.push({
            ...bahan,
            _rowId: batch.id,
            _stok: batch.sisa,
            _tanggal_masuk: batch.tanggal_masuk,
            _tanggal_kadaluarsa: batch.expired_date,
            _mendekati_expired: batch.mendekati_expired,
            stok: batch.sisa,
            is_sudah_expired: batch.sudah_expired,
            is_mendekati_expired: batch.mendekati_expired,
            batch_terdekat_expired: {
              tanggal_masuk: batch.tanggal_masuk,
              expired_date: batch.expired_date,
              sisa: batch.sisa,
            }
          });
        });
      } else {
        flattened.push({
          ...bahan,
          _rowId: bahan.id + '-empty',
          _stok: 0,
          _tanggal_masuk: null,
          _tanggal_kadaluarsa: null,
          _mendekati_expired: false,
          stok: 0,
          is_sudah_expired: false,
          is_mendekati_expired: false,
          batch_terdekat_expired: null,
        });
      }
    });

    return flattened;
  }, [bahanList]);

  const sortedList = useMemo(() => {
    return [...flatBahanList].sort((a, b) => {
      let av: string | number | null = "";
      let bv: string | number | null = "";

      if (sortKey === "id") { av = a._rowId; bv = b._rowId; }
      else if (sortKey === "nama") { av = a.bahan_master?.nama || ""; bv = b.bahan_master?.nama || ""; }
      else if (sortKey === "stok") { av = a._stok; bv = b._stok; }
      else if (sortKey === "satuan") { av = a.bahan_master?.satuan || ""; bv = b.bahan_master?.satuan || ""; }
      else if (sortKey === "tanggal_masuk") { av = a._tanggal_masuk || ""; bv = b._tanggal_masuk || ""; }
      else if (sortKey === "tanggal_kadaluarsa") { av = a._tanggal_kadaluarsa || ""; bv = b._tanggal_kadaluarsa || ""; }

      if (sortKey === "tanggal_kadaluarsa") {
        if (!av) av = "9999-12-31"; // Push null dates to bottom
        if (!bv) bv = "9999-12-31";
      }

      if (av === null) av = "";
      if (bv === null) bv = "";

      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [flatBahanList, sortKey, sortDir]);

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronsUpDown className="w-3 h-3 ml-1 opacity-40" />;
    return sortDir === "asc" ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />;
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(date);
  };

  return (
    <div className="p-6 space-y-6 bg-transparent">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Kelola Bahan Baku</h1>
        <p className="text-sm text-gray-500 mt-0.5">Informasi detail bahan baku</p>
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
          <Select value={satuan} onValueChange={setSatuan}>
            <SelectTrigger className="h-9 w-36 text-sm border-gray-200 rounded-full">
              <SelectValue placeholder="Satuan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Satuan</SelectItem>
              <SelectItem value="kg">Kilogram (kg)</SelectItem>
              <SelectItem value="gram">Gram</SelectItem>
              <SelectItem value="liter">Liter</SelectItem>
              <SelectItem value="pcs">Pcs</SelectItem>
              <SelectItem value="porsi">Porsi</SelectItem>
              <SelectItem value="lusin">Lusin</SelectItem>
              <SelectItem value="botol">Botol</SelectItem>
              <SelectItem value="sachet">Sachet</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button 
          onClick={() => setRestockOpen(true)}
          className="h-9 rounded-lg bg-orange-600 hover:bg-orange-700 text-white gap-1.5 px-4 text-sm cursor-pointer"
        >
          <Plus className="size-4" /> Restock
        </Button>
      </div>

      <RestockModal open={restockOpen} onOpenChange={setRestockOpen} />

      <div className="rounded-xl border border-gray-200 overflow-hidden bg-white mt-4 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-gray-200">
              {[
                { key: "id" as SortKey, label: "No", className: "w-16 text-center" },
                { key: "nama" as SortKey, label: "Nama Bahan Baku", className: "" },
                { key: "stok" as SortKey, label: "Jumlah", className: "text-center" },
                { key: "satuan" as SortKey, label: "Satuan", className: "text-center" },
                { key: "tanggal_masuk" as SortKey, label: "Tanggal Masuk", className: "text-center" },
                { key: "tanggal_kadaluarsa" as SortKey, label: "Tanggal Kadaluarsa", className: "text-center" },
              ].map((col) => {
                const isSortable = true;
                return (
                  <TableHead
                    key={col.key}
                    className={cn(col.className, "cursor-pointer select-none py-3")}
                    onClick={() => handleSort(col.key)}
                  >
                    <div className={cn("flex items-center text-gray-600 font-semibold text-sm", 
                      (col.key === "id" || col.key === "stok" || col.key === "satuan" || col.key === "tanggal_masuk" || col.key === "tanggal_kadaluarsa") && "justify-center"
                    )}>
                      {col.label}
                      <SortIcon col={col.key} />
                    </div>
                  </TableHead>
                );
              })}
              <TableHead className="w-28 text-center text-gray-600 font-semibold text-sm py-3">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-400 py-12 text-sm">
                  <Loader2 className="size-6 animate-spin text-blue-600 mx-auto" />
                </TableCell>
              </TableRow>
            )}
            {isError && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-red-500 py-12 text-sm">
                  Gagal mengambil data dari server.
                </TableCell>
              </TableRow>
            )}
            {!isLoading && !isError && sortedList.map((row, index) => {
              const actualIndex = sortKey === "id" && sortDir === "desc" 
                ? (meta ? meta.total - ((meta.current_page - 1) * meta.per_page) - index : sortedList.length - index)
                : (meta ? (meta.current_page - 1) * meta.per_page + index + 1 : index + 1);
              return (
                <TableRow key={row._rowId} className="hover:bg-gray-50/50 border-gray-100 transition-colors">
                  <TableCell className="text-gray-500 text-sm text-center py-3">
                    {actualIndex}
                  </TableCell>
                  <TableCell className="text-gray-800 text-sm py-3">
                    {row.bahan_master?.nama || "-"}
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm text-center py-3">
                    {row._stok}
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm text-center py-3">
                    {(row.bahan_master?.konversi_ke_dasar || 1) > 1 
                      ? (row.bahan_master?.satuan_dasar || row.bahan_master?.satuan || "-")
                      : (row.bahan_master?.satuan || "-")}
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm text-center py-3">
                    {formatDate(row._tanggal_masuk || null)}
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm text-center py-3">
                    <span className={cn(
                      row._mendekati_expired ? "text-orange-500 font-semibold" : ""
                    )}>
                      {formatDate(row._tanggal_kadaluarsa || null)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => setDetailItem(row as BahanOutlet)}
                        className="bg-[#3874BC] hover:bg-[#2c5b96] text-white flex items-center justify-center w-7 h-7 rounded-full mx-auto transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {!isLoading && !isError && sortedList.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-400 py-12 text-sm">
                  Tidak ada data ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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

      <DetailBahanBakuDialog 
        bahan={detailItem} 
        onClose={() => setDetailItem(null)} 
      />
    </div>
  );
}
