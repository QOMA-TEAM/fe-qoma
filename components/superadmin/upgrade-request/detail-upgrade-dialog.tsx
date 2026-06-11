"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SubscriptionUpgrade, approveUpgrade, rejectUpgrade } from "@/hooks/superadmin/use-subscription";
import { toast } from "sonner";
import { formatRupiah } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface DetailUpgradeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  request: SubscriptionUpgrade | null;
  onSuccess: () => void;
}

export function DetailUpgradeDialog({
  isOpen,
  onClose,
  request,
  onSuccess,
}: DetailUpgradeDialogProps) {
  const [loadingAction, setLoadingAction] = useState<"approve" | "reject" | null>(null);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  if (!request) return null;

  const handleApprove = async () => {
    try {
      setLoadingAction("approve");
      await approveUpgrade(request.id);
      toast.success("Upgrade berhasil disetujui!");
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Gagal menyetujui upgrade");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Alasan penolakan harus diisi!");
      return;
    }

    try {
      setLoadingAction("reject");
      await rejectUpgrade(request.id, rejectReason);
      toast.success("Upgrade berhasil ditolak!");
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Gagal menolak upgrade");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleClose = () => {
    if (loadingAction) return;
    setShowRejectForm(false);
    setRejectReason("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {showRejectForm ? "Tolak Request Upgrade" : "Detail Request Upgrade"}
          </DialogTitle>
          <DialogDescription>
            {showRejectForm
              ? "Silakan masukkan alasan mengapa request upgrade ini ditolak."
              : "Periksa kembali detail request upgrade sebelum memberikan persetujuan."}
          </DialogDescription>
        </DialogHeader>

        {!showRejectForm ? (
          <div className="space-y-4 py-4">
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between border-b pb-2 border-gray-200">
                <span className="text-sm text-gray-500 font-medium">Usaha</span>
                <span className="text-sm font-semibold text-gray-900 text-right">{request.nama_perusahaan}</span>
              </div>
              <div className="flex justify-between border-b pb-2 border-gray-200">
                <span className="text-sm text-gray-500 font-medium">Owner</span>
                <span className="text-sm font-semibold text-gray-900 text-right">{request.nama_owner}</span>
              </div>
              <div className="flex justify-between border-b pb-2 border-gray-200">
                <span className="text-sm text-gray-500 font-medium">Plan Tujuan</span>
                <span className="text-sm font-semibold text-[#1D5E84] text-right">{request.jenis_subscription}</span>
              </div>
              <div className="flex justify-between border-b pb-2 border-gray-200">
                <span className="text-sm text-gray-500 font-medium">Total Harga</span>
                <span className="text-sm font-semibold text-green-600 text-right">{formatRupiah(request.harga)}</span>
              </div>
              <div className="flex justify-between pb-1 border-gray-200">
                <span className="text-sm text-gray-500 font-medium">Tanggal Request</span>
                <span className="text-sm font-semibold text-gray-900 text-right">
                  {new Date(request.start_subscription).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-4">
            <Textarea
              placeholder="Masukkan alasan penolakan..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="min-h-[120px] resize-none"
            />
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-2 mt-4">
          {!showRejectForm ? (
            <>
              <Button
                className="w-full sm:w-auto bg-[#D92D20] hover:bg-[#B42318] text-white"
                onClick={() => setShowRejectForm(true)}
                disabled={!!loadingAction}
              >
                Tolak
              </Button>
              <Button
                className="w-full sm:w-auto bg-[#1D5E84] hover:bg-[#1D5E84]/90 text-white"
                onClick={handleApprove}
                disabled={!!loadingAction}
              >
                {loadingAction === "approve" && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Approve
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => {
                  setShowRejectForm(false);
                  setRejectReason("");
                }}
                disabled={!!loadingAction}
              >
                Kembali
              </Button>
              <Button
                variant="destructive"
                className="w-full sm:w-auto"
                onClick={handleReject}
                disabled={!!loadingAction || !rejectReason.trim()}
              >
                {loadingAction === "reject" && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Konfirmasi Penolakan
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
