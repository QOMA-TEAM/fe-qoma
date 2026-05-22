"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Loader2 } from "lucide-react";
import { subscriptionService } from "@/hooks/superadmin/new-tenant";
import type { SubscriptionDetailResponse } from "@/types/superadmin/new-tenant";

interface Props {
  subscriptionId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void; // callback untuk refresh tabel setelah konfirmasi
}

export function NewTenantFormDialog({
  subscriptionId,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const [data, setData] = useState<SubscriptionDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch detail saat dialog dibuka
  useEffect(() => {
    if (!open || !subscriptionId) return;

    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await subscriptionService.detail(subscriptionId);
        setData(res);
      } catch {
        setError("Gagal memuat data subscription.");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [open, subscriptionId]);

  const handleKonfirmasi = async () => {
    if (!subscriptionId) return;
    setConfirming(true);
    setError(null);
    try {
      await subscriptionService.konfirmasiPembayaran(subscriptionId);
      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setError(msg ?? "Gagal mengkonfirmasi pembayaran.");
    } finally {
      setConfirming(false);
    }
  };

  const sub = data?.detail_subscription;
  const usaha = data?.detail_usaha;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold flex items-center gap-2">
            <CheckCircle size={18} className="text-emerald-500" />
            Konfirmasi Pembayaran Tenant
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-500">
            Pastikan pembayaran sudah diterima sebelum mengkonfirmasi.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="space-y-3 py-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-full" />
            ))}
          </div>
        ) : data ? (
          <div className="space-y-4 py-1">
            {/* Ringkasan yang akan dikonfirmasi */}
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 space-y-2">
              <Row
                label="Nama Perusahaan"
                value={usaha?.nama_perusahaan ?? "-"}
              />
              <Row label="Owner" value={usaha?.owner.nama ?? "-"} />
              <Separator className="my-1" />
              <Row label="Plan" value={sub?.plan.nama_plan ?? "-"} />
              <Row
                label="Total Bayar"
                value={`Rp ${Number(sub?.plan.harga ?? 0).toLocaleString("id-ID")}`}
                highlight
              />
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              Dengan mengkonfirmasi, status subscription akan berubah menjadi{" "}
              <span className="font-semibold text-emerald-600">active</span>,
              usaha akan disetujui, dan owner akan mendapat notifikasi.
            </p>

            {error && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
          </div>
        ) : error ? (
          <p className="text-sm text-red-500 py-4 text-center">{error}</p>
        ) : null}

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={confirming}
          >
            Batal
          </Button>
          <Button
            onClick={handleKonfirmasi}
            disabled={loading || confirming || !data}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {confirming ? (
              <>
                <Loader2 size={14} className="animate-spin mr-2" />
                Mengkonfirmasi...
              </>
            ) : (
              "Konfirmasi Pembayaran"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-500">{label}</span>
      <span
        className={
          highlight ? "font-bold text-emerald-700" : "font-medium text-gray-800"
        }
      >
        {value}
      </span>
    </div>
  );
}
