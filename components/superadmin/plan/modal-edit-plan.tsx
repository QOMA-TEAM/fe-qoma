"use client";

import { useEffect, useState } from "react";
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
import { PlanFormFields } from "./plan-form-dialog";
import {
  CreatePlanPayload,
  Plan,
  UpdatePlanPayload,
} from "@/types/superadmin/plan";

interface ModalEditPlanProps {
  open: boolean;
  plan: Plan | null;
  onClose: () => void;
  onSubmit: (id: string, payload: UpdatePlanPayload) => Promise<boolean>;
  submitting?: boolean;
}

type Errors = Partial<Record<keyof CreatePlanPayload, string>>;

function validate(values: Partial<CreatePlanPayload>): Errors {
  const errors: Errors = {};
  if (!values.nama_plan?.trim()) errors.nama_plan = "Nama plan wajib diisi";
  if ((values.harga ?? 0) < 0) errors.harga = "Harga tidak boleh negatif";
  if ((values.batas_outlet ?? 1) < 1) errors.batas_outlet = "Minimal 1 outlet";
  if (!values.tagihan) errors.tagihan = "Tagihan wajib dipilih";
  return errors;
}

export function ModalEditPlan({
  open,
  plan,
  onClose,
  onSubmit,
  submitting,
}: ModalEditPlanProps) {
  const [values, setValues] = useState<Partial<CreatePlanPayload>>({});
  const [errors, setErrors] = useState<Errors>({});

  // Sync plan data ke form saat modal dibuka
  useEffect(() => {
    if (plan) {
      setValues({
        nama_plan: plan.nama_plan,
        harga: plan.harga,
        batas_outlet: plan.batas_outlet,
        tagihan: plan.tagihan,
        status: plan.status,
        deskripsi: plan.deskripsi ?? "",
      });
      setErrors({});
    }
  }, [plan]);

  const handleChange = (
    field: keyof CreatePlanPayload,
    value: string | number,
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async () => {
    const errs = validate(values);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    if (!plan) return;
    const ok = await onSubmit(plan.id, values);
    if (ok) {
      setErrors({});
      onClose();
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-md rounded-xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-5 pb-4">
          <DialogTitle className="text-base font-semibold text-gray-900">
            Edit Plan
          </DialogTitle>
        </DialogHeader>

        <Separator />

        <div className="px-6 py-5">
          <PlanFormFields
            values={values}
            onChange={handleChange}
            errors={errors}
          />
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
            className="min-w-[80px] bg-blue-700 hover:bg-blue-800 text-white"
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
