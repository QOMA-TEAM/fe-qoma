// components/superadmin/plan/modal-edit-plan.tsx
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
import { PlanFormFields, PlanFormValues, PlanFormErrors } from "./plan-form-dialog";
import { Plan, UpdatePlanPayload, CreatePlanPayload, TAGIHAN_TO_HARI, PlanTagihan } from "@/types/superadmin/plan";
import { PlanActionOptions } from "@/hooks/superadmin/use-plan";

interface ModalEditPlanProps {
  open: boolean;
  plan: Plan | null;
  allPlans: Plan[];
  onClose: () => void;
  onUpdate: (id: string, payload: UpdatePlanPayload, opts?: PlanActionOptions) => Promise<boolean>;
  onCreate: (payload: CreatePlanPayload, opts?: PlanActionOptions) => Promise<boolean>;
  onDelete: (id: string, opts?: PlanActionOptions) => Promise<boolean>;
  submitting?: boolean;
}

// Urutan durasi dari pendek ke panjang
const TAGIHAN_ORDER: PlanTagihan[] = ["30 Hari", "60 Hari", "90 Hari", "365 Hari"];

function validate(values: Partial<PlanFormValues>): PlanFormErrors {
  const errors: PlanFormErrors = {};
  if (!values.nama_plan?.trim()) errors.nama_plan = "Nama plan wajib diisi";
  if ((values.batas_outlet ?? 1) < 1) errors.batas_outlet = "Minimal 1 outlet";
  if (!values.selectedTagihan || values.selectedTagihan.length === 0) {
    errors.selectedTagihan = "Tagihan wajib dipilih";
  } else {
    const tagihan = values.selectedTagihan[0];
    const harga = values.hargaMap?.[tagihan];
    if (harga === undefined || harga < 0 || harga === null) {
      errors[`harga_${tagihan}`] = "Harga tidak valid";
    }

    // Validasi urutan harga: durasi lebih panjang harus >= durasi lebih pendek
    const selected = values.selectedTagihan;
    const hargaMap = values.hargaMap ?? {};
    const sortedSelected = TAGIHAN_ORDER.filter((t) => selected.includes(t));
    for (let i = 1; i < sortedSelected.length; i++) {
      const prev = sortedSelected[i - 1];
      const curr = sortedSelected[i];
      const hargaPrev = hargaMap[prev] ?? 0;
      const hargaCurr = hargaMap[curr] ?? 0;
      if (hargaCurr < hargaPrev) {
        errors[`harga_${curr}`] =
          `Harga ${curr} harus lebih mahal dari harga ${prev}`;
      }
    }
  }
  return errors;
}

export function ModalEditPlan({
  open,
  plan,
  allPlans,
  onClose,
  onUpdate,
  onCreate,
  onDelete,
  submitting,
}: ModalEditPlanProps) {
  const [values, setValues] = useState<Partial<PlanFormValues>>({});
  const [errors, setErrors] = useState<PlanFormErrors>({});
  const [originalIds, setOriginalIds] = useState<Record<string, string>>({}); // map tagihan to plan id
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (plan && open && allPlans) {
      // Find all plans that share this exact nama_plan
      const groupedPlans = allPlans.filter(p => p.nama_plan === plan.nama_plan);
      
      const selected: PlanTagihan[] = [];
      const hargaMap: Record<string, number> = {};
      const ids: Record<string, string> = {};

      groupedPlans.forEach(p => {
        selected.push(p.tagihan);
        hargaMap[p.tagihan] = p.harga;
        ids[p.tagihan] = p.id;
      });

      setValues({
        nama_plan: plan.nama_plan,
        batas_outlet: plan.batas_outlet,
        selectedTagihan: selected, 
        hargaMap: hargaMap,
        status: plan.status,
        deskripsi: plan.deskripsi ?? "",
      });
      setOriginalIds(ids);
      setErrors({});
    }
  }, [plan, open, allPlans]);

  const handleChange = (field: keyof PlanFormValues, value: any) => {
    setValues((prev: Partial<PlanFormValues>) => ({ ...prev, [field]: value }));
    if (errors[field as keyof PlanFormErrors]) setErrors((prev: PlanFormErrors) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async () => {
    const errs = validate(values);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    if (!plan) return;

    setIsProcessing(true);
    let allSuccess = true;

    const newTagihans = values.selectedTagihan || [];
    const oldTagihans = Object.keys(originalIds) as PlanTagihan[];
    
    // Collect all operations to execute
    const ops: Array<(opts: PlanActionOptions) => Promise<boolean>> = [];

    // 1. Update existing or Create new variations
    for (const tagihan of newTagihans) {
      const harga = values.hargaMap?.[tagihan] || 0;
      const payload = {
        nama_plan: values.nama_plan!,
        harga: harga,
        durasi_hari: TAGIHAN_TO_HARI[tagihan],
        batas_outlet: values.batas_outlet!,
        deskripsi: values.deskripsi ?? null,
        status: values.status!,
      };

      if (originalIds[tagihan]) {
        // Variant existed -> Update
        ops.push((opts) => onUpdate(originalIds[tagihan], payload as UpdatePlanPayload, opts));
      } else {
        // New variant checked -> Create
        ops.push((opts) => onCreate(payload as CreatePlanPayload, opts));
      }
    }

    // 2. Delete variations that were unchecked
    for (const tagihan of oldTagihans) {
      if (!newTagihans.includes(tagihan)) {
        ops.push((opts) => onDelete(originalIds[tagihan], opts));
      }
    }

    // Execute operations sequentially
    for (let i = 0; i < ops.length; i++) {
      const isLast = i === ops.length - 1;
      const ok = await ops[i]({ showToast: isLast, skipFetch: !isLast });
      if (!ok) allSuccess = false;
    }

    setIsProcessing(false);

    if (allSuccess) {
      setErrors({});
      onClose();
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o: boolean) => !o && handleClose()}>
      <DialogContent className="sm:max-w-3xl rounded-xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-5 pb-4">
          <DialogTitle className="text-base font-semibold text-gray-900">
            Edit Plan
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
            disabled={submitting || isProcessing}
            className="min-w-[80px] bg-[#C92A2A] hover:bg-[#A12121] text-white rounded-md cursor-pointer"
          >
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || isProcessing}
            className="min-w-[80px] bg-[#1D5E84] hover:bg-[#154663] text-white rounded-md cursor-pointer"
          >
            {(submitting || isProcessing) ? (
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