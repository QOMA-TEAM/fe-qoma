"use client";

import { useState, useMemo } from "react";
import { Search, Loader2, ChevronUp, ChevronDown, ChevronsUpDown, Pencil } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useOutletMenu } from "@/hooks/outlet/use-menu";
import { useDebounce } from "@/hooks/use-debounce";

type SortKey = "id" | "nama" | "kategori" | "harga";
type SortDir = "asc" | "desc";

import { EditMenuDialog } from "@/components/outlet/menu/edit-menu-dialog";
import type { OutletMenu } from "@/services/outlet/menu-outlet-service";

export function MenuContent() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [detailItem, setDetailItem] = useState<OutletMenu | null>(null);
  
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua Kategori");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  const debouncedSearch = useDebounce(search, 800);

  // Fetch Data
  const { data: response, isLoading, isError } = useOutletMenu(page, debouncedSearch, selectedCategoryId);
  const items = response?.data || [];
  const meta = response?.meta;
  const kategoris = response?.kategoris || [];

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((p) => (p === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(angka);
  };

  const sorted = useMemo(() => {
    return [...items].sort((a, b) => {
      const av = a[sortKey] || "";
      const bv = b[sortKey] || "";
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [items, sortKey, sortDir]);

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronsUpDown className="w-3 h-3 ml-1 opacity-40" />;
    return sortDir === "asc" ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />;
  };

  const columns: { key: SortKey; label: string; className?: string }[] = [
    { key: "id", label: "No", className: "w-16 text-center" },
    { key: "nama", label: "Nama Menu" },
    { key: "kategori", label: "Kategori", className: "w-40" },
    { key: "harga", label: "Harga", className: "w-40" },
  ];

  return (
    <div className="p-6 space-y-6 bg-transparent">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Kelola Menu</h1>
        <p className="text-sm text-gray-500 mt-0.5">Informasi detail menu dan resep</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 flex-wrap sm:justify-between">
        <div className="flex gap-2">
          <div className="relative">
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pr-9 h-9 w-44 text-sm border-gray-200 rounded-full bg-white"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1.5 text-sm border-gray-200 text-gray-700 h-9 rounded-full px-4 cursor-pointer bg-white">
                {selectedCategory === "Semua Kategori" ? "Kategori" : selectedCategory} <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 max-h-[300px] overflow-y-auto">
              <DropdownMenuItem
                onClick={() => { setSelectedCategory("Semua Kategori"); setSelectedCategoryId(""); setPage(1); }}
                className={cn("cursor-pointer", selectedCategory === "Semua Kategori" && "font-medium text-blue-600")}
              >
                Semua Kategori
              </DropdownMenuItem>
              {kategoris.map((cat) => (
                <DropdownMenuItem
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.nama); setSelectedCategoryId(cat.id); setPage(1); }}
                  className={cn("cursor-pointer", selectedCategory === cat.nama && "font-medium text-blue-600")}
                >
                  {cat.nama}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-gray-200">
              {columns.map((col) => {
                const isSortable = col.key === "harga";
                return (
                  <TableHead
                    key={col.key}
                    className={cn(col.className, isSortable && "cursor-pointer select-none")}
                    onClick={isSortable ? () => handleSort(col.key) : undefined}
                  >
                    <div className={cn("flex items-center text-gray-600 font-semibold text-sm", col.key === "id" && "justify-center")}>
                      {col.label}
                      {isSortable && <SortIcon col={col.key} />}
                    </div>
                  </TableHead>
                );
              })}
              <TableHead className="w-24 text-center text-gray-600 font-semibold text-sm">Status</TableHead>
              <TableHead className="w-24 text-center text-gray-600 font-semibold text-sm">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={7} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    <p className="text-sm text-gray-500">Memuat data menu...</p>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {isError && (
              <TableRow>
                <TableCell colSpan={7} className="h-64 text-center">
                  <div className="text-red-500 font-medium">Gagal mengambil data dari server.</div>
                </TableCell>
              </TableRow>
            )}

            {!isLoading && !isError && sorted.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-64 text-center text-gray-500">
                  Tidak ada menu ditemukan.
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              !isError &&
              sorted.map((row, index) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-blue-50/30 transition-colors border-b border-gray-100"
                >
                  <TableCell className="text-center py-4 text-gray-600">
                    {sortKey === "id" && sortDir === "desc"
                      ? (meta ? meta.total - ((meta.current_page - 1) * meta.per_page) - index : sorted.length - index)
                      : (meta ? (meta.current_page - 1) * meta.per_page + index + 1 : index + 1)}
                  </TableCell>
                  
                  <TableCell className="py-4 text-gray-800 text-sm font-medium">
                    {row.nama}
                  </TableCell>

                  <TableCell className="py-4 text-gray-600">
                    {row.kategori}
                  </TableCell>

                  <TableCell className="py-4 text-gray-900 font-medium">
                    {formatRupiah(row.harga)}
                  </TableCell>

                  <TableCell className="text-center py-4">
                    {row.is_available ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 font-medium">
                        Tersedia
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0 font-medium">
                        Habis
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-center py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => setDetailItem(row)}
                        className="flex items-center justify-center size-7 bg-[#3874BC] hover:bg-[#2c5b96] text-white rounded-md transition-colors cursor-pointer shadow-sm"
                        title="Edit Menu"
                      >
                        <Pencil className="size-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {meta && meta.total > 0 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-gray-500">
            Menampilkan Halaman <span className="font-medium text-gray-900">{meta.current_page}</span> dari{" "}
            <span className="font-medium text-gray-900">{meta.last_page}</span> halaman
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
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
              onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
              disabled={page === meta.last_page}
              className="h-8 rounded-full px-4 text-xs font-medium cursor-pointer"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <EditMenuDialog 
        menu={detailItem} 
        onClose={() => setDetailItem(null)} 
      />
      </div>
    </div>
  );
}
