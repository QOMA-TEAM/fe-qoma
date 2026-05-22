"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, XCircle } from "lucide-react";
import { subscriptionService } from "@/hooks/superadmin/new-tenant";

interface Props {
  subscriptionId: string | null;
  namaTenant: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CancelSubscriptionDialog({
  subscriptionId,
  namaTenant,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const [alasan, setAlasan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCancel = async () => {
    if (!subscriptionId || !alasan.trim()) return;

    setLoading(true);
    setError(null);
    try {
      await subscriptionService.cancel(subscriptionId, {
        alasan: alasan.trim(),
      });
      setAlasan("");
      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setError(msg ?? "Gagal membatalkan subscription.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setAlasan("");
    setError(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold text-red-600">
            <XCircle size={18} />
            Batalkan Subscription
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-500">
            Tindakan ini akan mengubah status subscription{" "}
            <span className="font-semibold text-gray-700">{namaTenant}</span>{" "}
            menjadi{" "}
            <span className="font-semibold text-red-600">cancelled</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-1">
          <div className="space-y-1.5">
            <Label htmlFor="alasan" className="text-sm font-medium">
              Alasan Pembatalan <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="alasan"
              placeholder="Masukkan alasan pembatalan subscription..."
              value={alasan}
              onChange={(e) => setAlasan(e.target.value)}
              rows={3}
              disabled={loading}
              className="resize-none text-sm"
            />
            <p className="text-xs text-gray-400">{alasan.length} karakter</p>
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Kembali
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={loading || !alasan.trim()}
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin mr-2" />
                Membatalkan...
              </>
            ) : (
              "Batalkan Subscription"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
