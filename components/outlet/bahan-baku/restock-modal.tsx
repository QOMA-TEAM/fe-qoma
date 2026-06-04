"use client";

import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBahanBakuList, useRestockBahanBaku } from "@/hooks/outlet/use-bahan-baku";
import { useDebounce } from "@/hooks/use-debounce";


interface RestockModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RestockModal({ open, onOpenChange }: RestockModalProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  // For simplicity, we just fetch page 1 in the modal. 
  // If there are many items, the user can search.
  const { data: response, isLoading } = useBahanBakuList(1, debouncedSearch);
  const items = response?.data || [];

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [jumlah, setJumlah] = useState("");
  const [tanggal, setTanggal] = useState("");

  const { mutate: restock, isPending } = useRestockBahanBaku();

  const selectedItem = useMemo(() => {
    return items.find((item) => item.id === selectedItemId) || null;
  }, [items, selectedItemId]);

  const pengeluaran = useMemo(() => {
    const qty = parseFloat(jumlah || "0");
    const harga = selectedItem ? parseFloat(selectedItem.bahan_master.harga_default?.toString() || "0") : 0;
    return qty * harga;
  }, [jumlah, selectedItem]);

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(angka);
  };

  const handleSubmit = () => {
    if (!selectedItem) return;
    if (!jumlah || parseFloat(jumlah) <= 0) return;

    restock(
      {
        bahan_master_id: selectedItem.bahan_master.id,
        jumlah: parseFloat(jumlah),
        tanggal_kadaluarsa: tanggal || null,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          // reset form
          setSelectedItemId(null);
          setJumlah("");
          setTanggal("");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] w-[95vw] p-0 overflow-hidden bg-white border-0 rounded-2xl sm:rounded-3xl shadow-xl">
        <DialogHeader className="px-8 pt-8 pb-2">
          <DialogTitle className="text-2xl font-bold text-gray-900 text-left">
            Restock Bahan Baku
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8 pb-8 mt-4">
          
          {/* LEFT COLUMN: FORM */}
          <div className="bg-[#F8F9FA] rounded-xl p-6 flex flex-col space-y-5">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {selectedItem ? selectedItem.bahan_master.nama : "Pilih Bahan Baku"}
            </h3>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Jumlah Bahan Baku</label>
              <Input
                type="number"
                min="0"
                placeholder="Masukkan jumlah bahan baku"
                value={jumlah}
                onChange={(e) => {
                  const val = e.target.value;
                  if (parseFloat(val) < 0) return;
                  setJumlah(val);
                }}
                className="h-11 bg-white border-0 focus-visible:ring-1 focus-visible:ring-blue-500 rounded-lg shadow-sm"
              />
            </div>

            <div className="space-y-1.5 relative">
              <label className="text-sm font-medium text-gray-700">Tanggal Kadaluarsa</label>
              <div className="relative">
                <Input
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="h-11 w-full bg-white border-0 focus-visible:ring-1 focus-visible:ring-blue-500 rounded-lg shadow-sm block"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Pengeluaran</label>
              <Input
                type="text"
                value={formatRupiah(pengeluaran)}
                readOnly
                className="h-11 bg-white border-0 text-gray-500 rounded-lg shadow-sm pointer-events-none"
              />
            </div>

            <div className="pt-4 mt-auto">
              <Button
                onClick={handleSubmit}
                disabled={!selectedItem || !jumlah || isPending}
                className="w-full h-12 bg-[#205284] hover:bg-[#1a4269] text-white font-semibold rounded-lg text-base"
              >
                {isPending ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Submit"}
              </Button>
            </div>
          </div>

          {/* RIGHT COLUMN: SELECTION GRID */}
          <div className="bg-[#F8F9FA] rounded-xl p-6 flex flex-col h-[450px]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
              <h3 className="text-base font-semibold text-gray-900">Nama Bahan Baku</h3>
              <div className="relative w-full sm:w-auto">
                <Input
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-40 h-8 pr-8 text-xs rounded-full border-gray-300"
                />
                <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-orange-500" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 pb-2 pl-1 pt-1 custom-scrollbar">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <p className="text-sm">Tidak ada bahan baku ditemukan.</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3 p-1">
                  {items.map((item) => {
                    const isSelected = selectedItemId === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedItemId(item.id)}
                        className={`flex flex-col items-center overflow-hidden rounded-xl border transition-all ${
                          isSelected
                            ? "border-emerald-500 ring-1 ring-emerald-500 bg-emerald-50"
                            : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                        }`}
                      >
                        <div className="w-full aspect-square bg-gray-100 flex items-center justify-center p-1 cursor-pointer">
                          {item.bahan_master.gambar ? (
                            <img
                              src={item.bahan_master.gambar.startsWith('http') ? item.bahan_master.gambar : `http://localhost:8000/storage/${item.bahan_master.gambar}`}
                              alt={item.bahan_master.nama}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-gray-400">
                              <span className="text-[10px] uppercase font-bold tracking-wider">No Img</span>
                            </div>
                          )}
                        </div>
                        <div className="w-full p-2 text-center border-t border-gray-100 bg-white/50 h-11 flex items-center justify-center">
                          <span className={`text-[11px] leading-tight font-medium line-clamp-2 ${isSelected ? "text-emerald-700" : "text-gray-700"}`}>
                            {item.bahan_master.nama}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
