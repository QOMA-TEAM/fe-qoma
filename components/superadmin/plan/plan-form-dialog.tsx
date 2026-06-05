"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, CalendarDays } from "lucide-react";
import {
  CreatePlanPayload,
  PlanStatus,
  PlanTagihan,
} from "@/types/superadmin/plan";

const TAGIHAN_OPTIONS: PlanTagihan[] = [
  "30 Hari",
  "60 Hari",
  "90 Hari",
  "365 Hari",
];

export interface PlanFormValues {
  nama_plan: string;
  selectedTagihan: PlanTagihan[];
  hargaMap: Record<string, number>;
  batas_outlet: number;
  deskripsi?: string | null;
  status: PlanStatus;
}

export type PlanFormErrors = Partial<Record<keyof PlanFormValues | string, string>>;

interface PlanFormFieldsProps {
  values: Partial<PlanFormValues>;
  onChange: (field: keyof PlanFormValues, value: any) => void;
  errors?: PlanFormErrors;
  isEditMode?: boolean;
}

export function PlanFormFields({
  values,
  onChange,
  errors,
  isEditMode = false,
}: PlanFormFieldsProps) {
  
  const selectedTagihan = values.selectedTagihan || [];
  const hargaMap = values.hargaMap || {};

  const toggleTagihan = (tagihan: PlanTagihan) => {
    let newSelected = [...selectedTagihan];
    let newHargaMap = { ...hargaMap };

    if (newSelected.includes(tagihan)) {
      newSelected = newSelected.filter((t) => t !== tagihan);
      delete newHargaMap[tagihan];
    } else {
      newSelected.push(tagihan);
      newHargaMap[tagihan] = 0; // Default harga 0
    }

    onChange("selectedTagihan", newSelected);
    onChange("hargaMap", newHargaMap);
  };

  const updateHarga = (tagihan: string, harga: number) => {
    onChange("hargaMap", { ...hargaMap, [tagihan]: harga });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* KIRI */}
        <div className="space-y-5">
          {/* Nama Plan */}
          <div className="space-y-1.5">
            <Label htmlFor="nama_plan" className="text-sm font-semibold text-gray-700">
              Nama Plan
            </Label>
            <Input
              id="nama_plan"
              placeholder="Contoh: Paket Pro"
              value={values.nama_plan ?? ""}
              onChange={(e) => onChange("nama_plan", e.target.value)}
              className={`h-10 border-gray-200 focus-visible:ring-[#1D5E84] ${
                errors?.nama_plan ? "border-red-400" : ""
              }`}
            />
            {errors?.nama_plan && (
              <p className="text-xs text-red-500">{errors.nama_plan}</p>
            )}
          </div>

          {/* Batas Outlet */}
          <div className="space-y-1.5">
            <Label htmlFor="batas_outlet" className="text-sm font-semibold text-gray-700">
              Batas Outlet
            </Label>
            <Input
              id="batas_outlet"
              type="number"
              min={1}
              placeholder="0"
              value={values.batas_outlet === 0 ? "" : values.batas_outlet?.toString()}
              onChange={(e) => onChange("batas_outlet", e.target.value === "" ? 0 : Number(e.target.value))}
              className={`h-10 border-gray-200 focus-visible:ring-[#1D5E84] ${
                errors?.batas_outlet ? "border-red-400" : ""
              }`}
            />
            {errors?.batas_outlet && (
              <p className="text-xs text-red-500">{errors.batas_outlet}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-gray-700">Status</Label>
            <Select
              value={values.status ?? "aktif"}
              onValueChange={(v) => onChange("status", v as PlanStatus)}
            >
              <SelectTrigger className="h-10 border-gray-200 focus:ring-[#1D5E84]">
                <SelectValue placeholder="Aktif" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aktif" className="text-sm">Aktif</SelectItem>
                <SelectItem value="tidak aktif" className="text-sm">Tidak Aktif</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Deskripsi */}
          <div className="space-y-1.5">
            <Label htmlFor="deskripsi" className="text-sm font-semibold text-gray-700">
              Deskripsi (Opsional)
            </Label>
            <Textarea
              id="deskripsi"
              placeholder="Deskripsi singkat plan ini..."
              value={values.deskripsi ?? ""}
              onChange={(e) => onChange("deskripsi", e.target.value)}
              className="resize-none min-h-[80px] border-gray-200 focus-visible:ring-[#1D5E84]"
            />
          </div>
        </div>

        {/* KANAN */}
        <div className="space-y-5">
          {/* Pilihan Tagihan */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">
              {isEditMode ? "Variasi Tagihan (Tidak dapat diubah)" : "Pilih Variasi Tagihan"}
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {TAGIHAN_OPTIONS.map((tagihan) => {
                const isSelected = selectedTagihan.includes(tagihan);
                return (
                  <button
                    key={tagihan}
                    type="button"
                    onClick={() => {
                      if (isEditMode) return;
                      toggleTagihan(tagihan);
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                      isSelected
                        ? "border-[#1D5E84] ring-1 ring-[#1D5E84] bg-blue-50"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                    } ${isEditMode && !isSelected ? "opacity-50 cursor-not-allowed bg-gray-50" : ""}
                      ${isEditMode && isSelected ? "cursor-default" : ""}`}
                  >
                    <CalendarDays className={`w-5 h-5 mb-2 ${isSelected ? "text-[#1D5E84]" : "text-gray-400"}`} />
                    <span className={`text-xs font-semibold ${isSelected ? "text-[#1D5E84]" : "text-gray-600"}`}>
                      {tagihan}
                    </span>
                  </button>
                );
              })}
            </div>
            {errors?.selectedTagihan && (
              <p className="text-xs text-red-500 mt-1">{errors.selectedTagihan}</p>
            )}
          </div>

          {/* List Tagihan & Harga Terpilih */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">Harga Variasi</Label>
            <div className="border border-gray-200 rounded-lg p-3 min-h-[160px] max-h-[220px] overflow-y-auto space-y-3 bg-gray-50/50">
              {selectedTagihan.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-6">Pilih variasi tagihan di atas untuk menentukan harga</p>
              ) : (
                selectedTagihan.map((tagihan) => (
                  <div key={tagihan} className="flex items-center gap-3 bg-white p-2 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <Label className="text-[11px] text-gray-500 mb-1 block">Variasi</Label>
                      <div className="flex items-center gap-1.5">
                        <Input value={tagihan} readOnly className="rounded-md border-gray-200 bg-gray-50 text-sm h-8 font-medium text-gray-700" />
                        {!isEditMode && (
                          <button type="button" onClick={() => toggleTagihan(tagihan)} className="text-gray-400 hover:text-red-500 transition-colors shrink-0">
                            <X className="size-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <Label className="text-[11px] text-gray-500 mb-1 block">Harga (Rp)</Label>
                      <Input
                        type="number"
                        min={0}
                        placeholder="0"
                        value={hargaMap[tagihan] === 0 ? "" : hargaMap[tagihan]?.toString()}
                        onChange={(e) => updateHarga(tagihan, e.target.value === "" ? 0 : Number(e.target.value))}
                        className={`rounded-md border-gray-200 focus-visible:ring-[#1D5E84] text-sm h-8 ${errors?.[`harga_${tagihan}`] ? "border-red-400" : ""}`}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
