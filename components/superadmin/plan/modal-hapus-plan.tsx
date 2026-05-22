"use client";

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
import { Plan } from "@/types/plan";

interface ModalHapusPlanProps {
  open: boolean;
  plan: Plan | null;
  onClose: () => void;
  onConfirm: (id: string) => Promise<boolean>;
  submitting?: boolean;
}

export function ModalHapusPlan({
  open,
  plan,
  onClose,
  onConfirm,
  submitting,
}: ModalHapusPlanProps) {
  const handleConfirm = async () => {
    if (!plan) return;
    const ok = await onConfirm(plan.id);
    if (ok) onClose();
  };

  return (
    <AlertDialog open={open} onOpenChange={(o) => !o && onClose()}>
      <AlertDialogContent className="sm:max-w-sm rounded-xl">
        <AlertDialogHeader className="items-center text-center gap-3">
          {/* Icon */}
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto">
            <Trash2 className="h-6 w-6 text-red-500" />
          </div>

          <AlertDialogTitle className="text-base font-semibold text-gray-900">
            Hapus Plan
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-gray-500">
            Yakin ingin menghapus plan{" "}
            <span className="font-semibold text-gray-800">
              &ldquo;{plan?.nama_plan}&rdquo;
            </span>
            ? Tindakan ini tidak dapat dibatalkan dan akan mempengaruhi
            subscription yang aktif.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-2 sm:gap-2 flex-row justify-center mt-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={submitting}
            className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={submitting}
            className="flex-1"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                Menghapus...
              </>
            ) : (
              "Hapus"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
