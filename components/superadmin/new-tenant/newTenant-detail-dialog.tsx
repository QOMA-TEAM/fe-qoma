"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { subscriptionService } from "@/services/superadmin/newTenantServices";
import type {
  SubscriptionDetailResponse,
  SubscriptionStatus,
} from "@/types/superadmin/new-tenant";
import { Building2, Mail, MapPin, User, CreditCard, Store } from "lucide-react";

interface Props {
  subscriptionId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusConfig: Record<
  SubscriptionStatus,
  { label: string; className: string }
> = {
  active: {
    label: "Aktif",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  pending: {
    label: "Pending",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  cancelled: {
    label: "Dibatalkan",
    className: "bg-red-100 text-red-700 border-red-200",
  },
  expired: {
    label: "Expired",
    className: "bg-gray-100 text-gray-600 border-gray-200",
  },
};

export function DetailNewTenantDialog({
  subscriptionId,
  open,
  onOpenChange,
}: Props) {
  const [data, setData] = useState<SubscriptionDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !subscriptionId) return;

    const fetch = async () => {
      setLoading(true);
      try {
        const res = await subscriptionService.detail(subscriptionId);
        setData(res);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [open, subscriptionId]);

  const sub = data?.detail_subscription;
  const usaha = data?.detail_usaha;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            Detail Subscription
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="space-y-3 py-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-full" />
            ))}
          </div>
        ) : data ? (
          <div className="space-y-5 py-1">
            {/* ── Subscription Info ── */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Subscription
              </p>
              <div className="grid grid-cols-2 gap-3">
                <InfoItem
                  icon={<CreditCard size={14} />}
                  label="Plan"
                  value={sub?.plan.nama_plan ?? "-"}
                />
                <InfoItem
                  label="Status"
                  value={
                    <Badge
                      variant="outline"
                      className={
                        statusConfig[sub?.status ?? "pending"].className
                      }
                    >
                      {statusConfig[sub?.status ?? "pending"].label}
                    </Badge>
                  }
                />
                <InfoItem
                  label="Harga"
                  value={`Rp ${Number(sub?.plan.harga ?? 0).toLocaleString("id-ID")}`}
                />
                <InfoItem
                  label="Batas Outlet"
                  value={`${sub?.plan.batas_outlet ?? 0} outlet`}
                />
                <InfoItem
                  label="Mulai"
                  value={
                    sub?.start_date
                      ? new Date(sub.start_date).toLocaleDateString("id-ID")
                      : "-"
                  }
                />
                <InfoItem
                  label="Dibuat"
                  value={
                    sub?.created_at
                      ? new Date(sub.created_at).toLocaleDateString("id-ID")
                      : "-"
                  }
                />
              </div>
            </div>

            <Separator />

            {/* ── Usaha Info ── */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Data Usaha
              </p>
              <div className="space-y-2">
                <InfoItem
                  icon={<Building2 size={14} />}
                  label="Nama Perusahaan"
                  value={usaha?.nama_perusahaan ?? "-"}
                />
                <InfoItem
                  icon={<Mail size={14} />}
                  label="Email Usaha"
                  value={usaha?.email ?? "-"}
                />
                <InfoItem
                  icon={<MapPin size={14} />}
                  label="Alamat"
                  value={usaha?.alamat ?? "-"}
                />
                <InfoItem
                  icon={<Store size={14} />}
                  label="Total Outlet"
                  value={`${usaha?.total_outlet ?? 0} outlet`}
                />
              </div>
            </div>

            <Separator />

            {/* ── Owner Info ── */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Data Owner
              </p>
              <div className="space-y-2">
                <InfoItem
                  icon={<User size={14} />}
                  label="Nama"
                  value={usaha?.owner.nama ?? "-"}
                />
                <InfoItem
                  label="Username"
                  value={`@${usaha?.owner.username ?? "-"}`}
                />
                <InfoItem
                  icon={<Mail size={14} />}
                  label="Email"
                  value={usaha?.owner.email ?? "-"}
                />
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

// ── Helper component ──────────────────────────────────────────────────────────
function InfoItem({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      {icon && <span className="text-gray-400 mt-0.5">{icon}</span>}
      <div className="min-w-0">
        <p className="text-xs text-gray-400">{label}</p>
        <div className="text-sm font-medium text-gray-800 truncate">
          {value}
        </div>
      </div>
    </div>
  );
}
