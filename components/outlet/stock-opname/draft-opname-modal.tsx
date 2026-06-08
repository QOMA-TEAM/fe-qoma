"use client";

import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Upload, X } from "lucide-react";
import { useBahanMasterList } from "@/hooks/outlet/use-bahan-baku";
import { useCreateDraftOpname, useUpdateDraftOpname } from "@/hooks/outlet/use-stock-opname";
import type { StockOpname } from "@/services/outlet/stock-opname-service";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draftToEdit?: StockOpname | null;
}

export function DraftOpnameModal({ open, onOpenChange, draftToEdit }: Props) {
  const [bahanMasterId, setBahanMasterId] = useState("");
  const [tipe, setTipe] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: bahanMasterResponse, isLoading: isLoadingBahan } = useBahanMasterList(1, "");
  const bahanMasterList = bahanMasterResponse?.data || [];

  const { mutate: createDraft, isPending: isCreating } = useCreateDraftOpname();
  const { mutate: updateDraft, isPending: isUpdating } = useUpdateDraftOpname();

  useEffect(() => {
    if (open) {
      if (draftToEdit) {
        setBahanMasterId(draftToEdit.bahan_master_id?.toString() || "");
        setTipe(draftToEdit.tipe || "");
        setJumlah(draftToEdit.jumlah?.toString() || "");
        setKeterangan(draftToEdit.keterangan || "");
        setFile(null);
        setPreviewUrl(draftToEdit.foto_bukti ? 
          (draftToEdit.foto_bukti.startsWith('http') ? draftToEdit.foto_bukti : `http://localhost:8000/storage/${draftToEdit.foto_bukti}`) 
          : null);
      } else {
        setBahanMasterId("");
        setTipe("");
        setJumlah("");
        setKeterangan("");
        setFile(null);
        setPreviewUrl(null);
      }
    }
  }, [open, draftToEdit]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("bahan_master_id", bahanMasterId);
    formData.append("tipe", tipe);
    formData.append("jumlah", jumlah);
    if (keterangan) formData.append("keterangan", keterangan);
    if (file) formData.append("foto_bukti", file);

    if (draftToEdit) {
      updateDraft(
        { id: draftToEdit.id, data: formData },
        { onSuccess: () => onOpenChange(false) }
      );
    } else {
      createDraft(formData, { onSuccess: () => onOpenChange(false) });
    }
  };

  const isPending = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {draftToEdit ? "Edit Draft Stock Opname" : "Tambah Draft Stock Opname"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Bahan Baku <span className="text-red-500">*</span></Label>
            <Select value={bahanMasterId} onValueChange={setBahanMasterId} required disabled={!!draftToEdit}>
              <SelectTrigger>
                <SelectValue placeholder={isLoadingBahan ? "Memuat..." : "Pilih bahan baku"} />
              </SelectTrigger>
              <SelectContent>
                {bahanMasterList.map((bahan) => (
                  <SelectItem key={bahan.id} value={bahan.id.toString()}>
                    {bahan.nama} ({bahan.satuan})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {draftToEdit && <p className="text-xs text-gray-500">Bahan baku tidak dapat diubah saat mengedit draft.</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipe Penyesuaian <span className="text-red-500">*</span></Label>
              <Select value={tipe} onValueChange={setTipe} required>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="busuk">Busuk</SelectItem>
                  <SelectItem value="rusak">Rusak</SelectItem>
                  <SelectItem value="ga_layak">Tidak Layak</SelectItem>
                  <SelectItem value="hilang">Hilang</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Jumlah <span className="text-red-500">*</span></Label>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={jumlah}
                onChange={(e) => setJumlah(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Keterangan</Label>
            <Textarea
              placeholder="Tambahkan keterangan opsional..."
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              className="resize-none h-20"
            />
          </div>

          <div className="space-y-2">
            <Label>Foto Bukti</Label>
            {previewUrl ? (
              <div className="relative w-full h-32 rounded-lg border overflow-hidden group">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                <Upload className="w-6 h-6 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Klik untuk upload foto</span>
                <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</span>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/jpg"
              className="hidden"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isPending || !bahanMasterId || !tipe || !jumlah}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {draftToEdit ? "Simpan Perubahan" : "Simpan Draft"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
