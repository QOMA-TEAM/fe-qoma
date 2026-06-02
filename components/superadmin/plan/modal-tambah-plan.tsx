// components/superadmin/plan/modal-tambah-plan.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { PlanFormFields, PlanFormValues, PlanFormErrors } from "./plan-form-dialog";
import { CreatePlanPayload, TAGIHAN_TO_HARI } from "@/types/superadmin/plan";

interface ModalTambahPlanProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreatePlanPayload) => Promise<boolean>;
  submitting?: boolean;
}

const INITIAL: PlanFormValues = {
  nama_plan: "",
  harga: 0,
  batas_outlet: 1,
  tagihan: "30 Hari",
  status: "aktif",           // ← sesuai PlanStatus backend
  deskripsi: "",
};

function validate(values: Partial<PlanFormValues>): PlanFormErrors {
  const errors: PlanFormErrors = {};
  if (!values.nama_plan?.trim()) errors.nama_plan = "Nama plan wajib diisi";
  if ((values.harga ?? 0) < 0) errors.harga = "Harga tidak boleh negatif";
  if ((values.batas_outlet ?? 1) < 1) errors.batas_outlet = "Minimal 1 outlet";
  if (!values.tagihan) errors.tagihan = "Tagihan wajib dipilih";
  return errors;
}

export function ModalTambahPlan({
  open,
  onClose,
  onSubmit,
  submitting,
}: ModalTambahPlanProps) {
  const [values, setValues] = useState<PlanFormValues>(INITIAL);
  const [errors, setErrors] = useState<PlanFormErrors>({});

  const handleChange = (field: keyof PlanFormValues, value: string | number) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async () => {
    const errs = validate(values);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    // Konversi label tagihan → angka hari sebelum kirim ke backend
    const payload: CreatePlanPayload = {
      nama_plan: values.nama_plan,
      harga: values.harga,
      durasi_hari: TAGIHAN_TO_HARI[values.tagihan],  // "365 Hari" → 365
      batas_outlet: values.batas_outlet,
      deskripsi: values.deskripsi ?? null,
      status: values.status,                          // "aktif" | "tidak aktif"
    };

    const ok = await onSubmit(payload);
    if (ok) {
      setValues(INITIAL);
      setErrors({});
      onClose();
    }
  };

  const handleClose = () => {
    setValues(INITIAL);
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-md rounded-xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-5 pb-4">
          <DialogTitle className="text-base font-semibold text-gray-900">
            Tambah Plan
          </DialogTitle>
        </DialogHeader>

        <Separator />

        <div className="px-6 py-5">
          <PlanFormFields values={values} onChange={handleChange} errors={errors} />
        </div>

        <Separator />

        <DialogFooter className="px-6 py-4 gap-2 flex-row justify-end">
          <Button
            variant="destructive"
            onClick={handleClose}
            disabled={submitting}
            className="min-w-[80px]"
          >
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="min-w-[80px] bg-[#1D5E84] hover:bg-[#154663] text-white"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}