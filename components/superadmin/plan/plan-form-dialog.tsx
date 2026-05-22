"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface PlanFormFieldsProps {
  values: Partial<CreatePlanPayload>;
  onChange: (field: keyof CreatePlanPayload, value: string | number) => void;
  errors?: Partial<Record<keyof CreatePlanPayload, string>>;
}

export function PlanFormFields({
  values,
  onChange,
  errors,
}: PlanFormFieldsProps) {
  return (
    <div className="space-y-4">
      {/* Nama Plan */}
      <div className="space-y-1.5">
        <Label
          htmlFor="nama_plan"
          className="text-sm font-medium text-gray-700"
        >
          Nama Plan
        </Label>
        <Input
          id="nama_plan"
          placeholder="Nama Plan"
          value={values.nama_plan ?? ""}
          onChange={(e) => onChange("nama_plan", e.target.value)}
          className={`h-10 border-gray-200 focus-visible:ring-blue-500 ${
            errors?.nama_plan ? "border-red-400" : ""
          }`}
        />
        {errors?.nama_plan && (
          <p className="text-xs text-red-500">{errors.nama_plan}</p>
        )}
      </div>

      {/* Harga + Tagihan */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="harga" className="text-sm font-medium text-gray-700">
            Harga (Rp)
          </Label>
          <Input
            id="harga"
            type="number"
            min={0}
            placeholder="0"
            value={values.harga === 0 ? "" : values.harga?.toString()}
            onChange={(e) => onChange("harga", e.target.value === "" ? 0 : Number(e.target.value))}
            className={`h-10 border-gray-200 focus-visible:ring-blue-500 ${
              errors?.harga ? "border-red-400" : ""
            }`}
          />
          {errors?.harga && (
            <p className="text-xs text-red-500">{errors.harga}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-gray-700">Tagihan</Label>
          <Select
            value={values.tagihan ?? ""}
            onValueChange={(v) => onChange("tagihan", v)}
          >
            <SelectTrigger
              className={`h-10 border-gray-200 focus:ring-blue-500 ${
                errors?.tagihan ? "border-red-400" : ""
              }`}
            >
              <SelectValue placeholder="30 Hari" />
            </SelectTrigger>
            <SelectContent>
              {TAGIHAN_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt} className="text-sm">
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.tagihan && (
            <p className="text-xs text-red-500">{errors.tagihan}</p>
          )}
        </div>
      </div>

      {/* Batas Outlet + Status */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label
            htmlFor="batas_outlet"
            className="text-sm font-medium text-gray-700"
          >
            Batas Outlet
          </Label>
          <Input
            id="batas_outlet"
            type="number"
            min={1}
            placeholder="0"
            value={values.batas_outlet === 0 ? "" : values.batas_outlet?.toString()}
            onChange={(e) => onChange("batas_outlet", e.target.value === "" ? 0 : Number(e.target.value))}
            className={`h-10 border-gray-200 focus-visible:ring-blue-500 ${
              errors?.batas_outlet ? "border-red-400" : ""
            }`}
          />
          {errors?.batas_outlet && (
            <p className="text-xs text-red-500">{errors.batas_outlet}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-gray-700">Status</Label>
          <Select
            value={values.status ?? "active"}
            onValueChange={(v) => onChange("status", v as PlanStatus)}
          >
            <SelectTrigger className="h-10 border-gray-200 focus:ring-blue-500">
              <SelectValue placeholder="Aktif" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active" className="text-sm">
                Aktif
              </SelectItem>
              <SelectItem value="inactive" className="text-sm">
                Tidak Aktif
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
