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
import { PlanActionOptions } from "@/hooks/superadmin/use-plan";

interface ModalTambahPlanProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreatePlanPayload, opts?: PlanActionOptions) => Promise<boolean>;
  submitting?: boolean;
}

const INITIAL: PlanFormValues = {
  nama_plan: "",
  batas_outlet: 1,
  selectedTagihan: [],
  hargaMap: {},
  status: "aktif",
  deskripsi: "",
};

function validate(values: Partial<PlanFormValues>): PlanFormErrors {
  const errors: PlanFormErrors = {};
  if (!values.nama_plan?.trim()) errors.nama_plan = "Nama plan wajib diisi";
  if ((values.batas_outlet ?? 1) < 1) errors.batas_outlet = "Minimal 1 outlet";
  
  if (!values.selectedTagihan || values.selectedTagihan.length === 0) {
    errors.selectedTagihan = "Pilih minimal satu variasi tagihan";
  } else {
    values.selectedTagihan.forEach((tagihan) => {
      const harga = values.hargaMap?.[tagihan];
      if (harga === undefined || harga < 0 || harga === null) {
        errors[`harga_${tagihan}`] = "Harga tidak valid";
      }
    });
  }
  
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
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (field: keyof PlanFormValues, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof PlanFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async () => {
    const errs = validate(values);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsProcessing(true);
    let allSuccess = true;

    // Loop for each selected variation and submit to backend sequentially
    for (let i = 0; i < values.selectedTagihan.length; i++) {
      const tagihan = values.selectedTagihan[i];
      const isLast = i === values.selectedTagihan.length - 1;
      const payload: CreatePlanPayload = {
        nama_plan: values.nama_plan,
        harga: values.hargaMap[tagihan] || 0,
        durasi_hari: TAGIHAN_TO_HARI[tagihan],
        batas_outlet: values.batas_outlet,
        deskripsi: values.deskripsi ?? null,
        status: values.status,
      };

      const ok = await onSubmit(payload, { showToast: isLast, skipFetch: !isLast });
      if (!ok) {
        allSuccess = false;
      }
    }

    setIsProcessing(false);

    if (allSuccess) {
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

  const isLoading = submitting || isProcessing;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-3xl rounded-xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-5 pb-4">
          <DialogTitle className="text-base font-semibold text-gray-900">
            Tambah Plan Multi-Variasi
          </DialogTitle>
        </DialogHeader>

        <Separator />

        <div className="px-6 py-5">
          <PlanFormFields values={values} onChange={handleChange} errors={errors} />
        </div>

        <Separator />

        <DialogFooter className="px-6 py-4 gap-2 flex-row justify-end">
          <Button
            onClick={handleClose}
            disabled={isLoading}
            className="min-w-[80px] bg-[#C92A2A] hover:bg-[#A12121] text-white rounded-md cursor-pointer"
          >
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="min-w-[80px] bg-[#1D5E84] hover:bg-[#154663] text-white rounded-md cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan Variasi Plan"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}