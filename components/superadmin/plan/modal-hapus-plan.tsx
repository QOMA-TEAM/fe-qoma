"use client";

import { useState } from "react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { Plan } from "@/types/superadmin/plan";
import { PlanActionOptions } from "@/hooks/superadmin/use-plan";

interface ModalHapusPlanProps {
  open: boolean;
  planGroup: Plan[] | null;
  onClose: () => void;
  onConfirm: (id: string, opts?: PlanActionOptions) => Promise<boolean>;
  submitting?: boolean;
}

export function ModalHapusPlan({
  open,
  planGroup,
  onClose,
  onConfirm,
  submitting,
}: ModalHapusPlanProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const representative = planGroup?.[0];

  const handleConfirm = async () => {
    if (!planGroup || planGroup.length === 0) return;
    
    setIsProcessing(true);
    let allOk = true;
    for (let i = 0; i < planGroup.length; i++) {
      const p = planGroup[i];
      const isLast = i === planGroup.length - 1;
      const ok = await onConfirm(p.id, { showToast: isLast, skipFetch: !isLast });
      if (!ok) allOk = false;
    }
    setIsProcessing(false);
    
    if (allOk) onClose();
  };

  const isLoading = submitting || isProcessing;

  return (
    <AlertDialog open={open} onOpenChange={(o) => !o && onClose()}>
      <AlertDialogContent className="sm:max-w-sm rounded-xl">
        <AlertDialogHeader className="items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto">
            <Trash2 className="h-6 w-6 text-red-500" />
          </div>

          <AlertDialogTitle className="text-base font-semibold text-gray-900">
            Hapus Plan
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-gray-500">
            Yakin ingin menghapus seluruh variasi plan{" "}
            <span className="font-semibold text-gray-800">
              &ldquo;{representative?.nama_plan}&rdquo;
            </span>
            ? Tindakan ini akan menghapus {planGroup?.length || 0} variasi tagihan secara permanen.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-2 sm:gap-2 flex-row justify-center mt-2">
          <Button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 bg-[#C92A2A] hover:bg-[#A12121] text-white rounded-md cursor-pointer"
          >
            Batal
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 bg-[#C92A2A] hover:bg-[#A12121] text-white rounded-md cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                Menghapus...
              </>
            ) : (
              "Hapus Semua"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}