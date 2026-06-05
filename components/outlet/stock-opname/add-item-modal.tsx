"use client";

import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, Image as ImageIcon } from "lucide-react";
import { useBahanBakuList } from "@/hooks/outlet/use-bahan-baku";
import { useAddStockOpnameItem } from "@/hooks/outlet/use-stock-opname";
import { useDebounce } from "@/hooks/use-debounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface AddItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  opnameId: string;
}

export function AddItemModal({ open, onOpenChange, opnameId }: AddItemModalProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data: response, isLoading } = useBahanBakuList(1, debouncedSearch);
  const items = response?.data || [];

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [kondisi, setKondisi] = useState("");
  const [stockRil, setStockRil] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { mutate: addItem, isPending } = useAddStockOpnameItem();

  const selectedItem = useMemo(() => {
    return items.find((item) => item.id === selectedItemId) || null;
  }, [items, selectedItemId]);

  const recentStock = selectedItem ? selectedItem.stok : 0;
  const stockHilang = useMemo(() => {
    const ril = parseFloat(stockRil || "0");
    return Math.max(0, recentStock - ril);
  }, [stockRil, recentStock]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleReset = () => {
    setSelectedItemId(null);
    setKondisi("");
    setStockRil("");
    setFile(null);
    setPreviewUrl(null);
    setSearch("");
  };

  const handleSubmit = () => {
    if (!selectedItem || !kondisi || !stockRil) return;

    const formData = new FormData();
    formData.append("bahan_master_id", selectedItem.bahan_master.id);
    formData.append("kondisi_stock", kondisi);
    formData.append("stock_ril", stockRil);
    if (file) {
      formData.append("foto_bukti", file);
    }

    addItem(
      { id: opnameId, data: formData },
      {
        onSuccess: () => {
          handleReset();
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!val) handleReset();
      onOpenChange(val);
    }}>
      <DialogContent className="sm:max-w-[700px] w-[95vw] p-0 overflow-hidden bg-white border-0 rounded-2xl shadow-xl">
        <DialogHeader className="px-8 pt-8 pb-4">
          <DialogTitle className="text-xl font-bold text-gray-900 text-left">
            Buat Barang Stock Opname Baru
          </DialogTitle>
        </DialogHeader>

        <div className="px-8 pb-8 flex flex-col h-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            {/* Kiri */}
            <div className="space-y-6">
              {/* Product Search Select */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Product</Label>
                <div className="relative">
                  {/* Custom Searchable Select implementation to match design */}
                  <Select value={selectedItemId || ""} onValueChange={setSelectedItemId}>
                    <SelectTrigger className="w-full bg-[#f8f9fa] border-0 h-11 px-4 shadow-none focus:ring-1 focus:ring-blue-500 rounded-lg">
                      <SelectValue placeholder="Search" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="p-2 sticky top-0 bg-white z-10 border-b border-gray-100">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            placeholder="Cari product..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 h-9 border-gray-200"
                            onKeyDown={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {isLoading ? (
                          <div className="flex justify-center p-4"><Loader2 className="w-4 h-4 animate-spin text-blue-500" /></div>
                        ) : items.length === 0 ? (
                          <div className="p-4 text-center text-sm text-gray-500">Tidak ada produk ditemukan</div>
                        ) : (
                          items.map(item => (
                            <SelectItem key={item.id} value={item.id} className="cursor-pointer">
                              {item.bahan_master.nama} (Stok: {item.stok})
                            </SelectItem>
                          ))
                        )}
                      </div>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Kondisi Barang</Label>
                <Select value={kondisi} onValueChange={setKondisi}>
                  <SelectTrigger className="w-full bg-[#f8f9fa] border-0 h-11 px-4 shadow-none focus:ring-1 focus:ring-blue-500 rounded-lg">
                    <SelectValue placeholder="Pilih Kondisi Barang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="broken_stock">Broken Stock</SelectItem>
                    <SelectItem value="hilang">Hilang</SelectItem>
                    <SelectItem value="busuk">Busuk</SelectItem>
                    <SelectItem value="rusak">Rusak</SelectItem>
                    <SelectItem value="ga_layak">Ga Layak</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Stock Ril</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Isi Stock Rill"
                  value={stockRil}
                  onChange={(e) => setStockRil(e.target.value)}
                  className="w-full bg-[#f8f9fa] border-0 h-11 px-4 shadow-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded-lg"
                />
              </div>
            </div>

            {/* Kanan */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Recent Stock</Label>
                <Input
                  type="text"
                  placeholder="Isi Recent Stock"
                  value={selectedItem ? recentStock : ""}
                  readOnly
                  className="w-full bg-[#f8f9fa] border-0 h-11 px-4 shadow-none text-gray-600 rounded-lg pointer-events-none"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Stock Hilang</Label>
                <Input
                  type="text"
                  placeholder="Isi Stock Rill" // Match placeholder from design
                  value={selectedItem && stockRil ? stockHilang : ""}
                  readOnly
                  className="w-full bg-[#f8f9fa] border-0 h-11 px-4 shadow-none text-gray-600 rounded-lg pointer-events-none"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Foto Pendukung</Label>
                <div className="w-full h-32 bg-[#f8f9fa] border-2 border-dashed border-gray-200 rounded-xl relative hover:bg-gray-50 transition-colors flex flex-col items-center justify-center cursor-pointer overflow-hidden">
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-contain p-1" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 gap-2">
                      <ImageIcon className="w-10 h-10" strokeWidth={1.5} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <Button
              onClick={handleSubmit}
              disabled={!selectedItem || !kondisi || !stockRil || isPending}
              className="w-full h-11 bg-[#2C74B3] hover:bg-[#205284] text-white font-medium rounded-lg"
            >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Tambah"}
            </Button>
            <Button
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="w-full h-11 bg-[#FF6B00] hover:bg-[#e66000] text-white font-medium rounded-lg"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
