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
import type { Tenant } from "@/types/superadmin/tenant";
import { useTenant } from "@/hooks/superadmin/use-tenant";

interface Props {
  tenant: Tenant | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string, alasan: string) => Promise<boolean>;
}

export function RejectTenantDialog({
  tenant,
  open,
  onOpenChange,
  onConfirm,
}: Props) {
  const [alasan, setAlasan] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReject = async () => {
    if (!tenant || !alasan.trim()) return;

    setLoading(true);
    const success = await onConfirm(tenant.id, alasan.trim());
    setLoading(false);
    
    if (success) {
      setAlasan("");
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setAlasan("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold text-red-600">
            Tolak Tenant
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-500">
            Tindakan ini akan menolak pendaftaran tenant{" "}
            <span className="font-semibold text-gray-700">{tenant?.nama_usaha}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-1">
          <div className="space-y-1.5">
            <Label htmlFor="alasan" className="text-sm font-medium">
              Alasan Penolakan <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="alasan"
              placeholder="Masukkan alasan menolak tenant ini..."
              value={alasan}
              onChange={(e) => setAlasan(e.target.value)}
              rows={3}
              disabled={loading}
              className="resize-none text-sm"
            />
            <p className="text-xs text-gray-400">{alasan.length} karakter</p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            onClick={handleClose}
            disabled={loading}
            className="bg-[#C92A2A] hover:bg-[#A12121] text-white rounded-md cursor-pointer"
          >
            Kembali
          </Button>
          <Button
            onClick={handleReject}
            disabled={loading || !alasan.trim()}
            className="bg-[#C92A2A] hover:bg-[#A12121] text-white rounded-md cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin mr-2" />
                Menolak...
              </>
            ) : (
              "Tolak Tenant"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
