"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Eye,
  CheckCircle,
  XCircle,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { subscriptionService } from "@/services/superadmin/newTenantServices";
import type {
  Subscription,
  SubscriptionStatus,
} from "@/types/superadmin/new-tenant";

import { DetailNewTenantDialog } from "@/components/superadmin/new-tenant/newTenant-detail-dialog";
import { NewTenantFormDialog } from "@/components/superadmin/new-tenant/newTenant-form-dialog";
import { CancelSubscriptionDialog } from "@/components/superadmin/new-tenant/modul-cancel";

// ── Status badge config ───────────────────────────────────────────────────────
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

export default function NewTenantPage() {
  // ── Data state ──────────────────────────────────────────────────────────────
  const [rows, setRows] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  // ── Filter state ────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");

  // ── Dialog state ────────────────────────────────────────────────────────────
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<string>("");

  const [detailOpen, setDetailOpen] = useState(false);
  const [konfirmOpen, setKonfirmOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  // ── Fetch ───────────────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await subscriptionService.list(
        {
          search: search || undefined,
          status: status !== "all" ? (status as SubscriptionStatus) : undefined,
        },
        15,
      );
      setRows(res.data);
      setLastPage(res.meta.last_page);
      setTotal(res.meta.total);
    } finally {
      setLoading(false);
    }
  }, [search, status, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const openDetail = (id: string) => {
    setSelectedId(id);
    setDetailOpen(true);
  };

  const openKonfirm = (id: string) => {
    setSelectedId(id);
    setKonfirmOpen(true);
  };

  const openCancel = (sub: Subscription) => {
    setSelectedId(sub.id);
    setSelectedName(sub.usaha.nama_usaha);
    setCancelOpen(true);
  };

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Kelola New Tenant</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Total <span className="font-semibold text-gray-700">{total}</span>{" "}
          subscription
        </p>
      </div>

      {/* ── Filters ── */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <Input
            placeholder="Cari nama usaha..."
            className="pl-9 w-64 text-sm"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-40 text-sm">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="cancelled">Dibatalkan</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left">
              {[
                "No",
                "Nama Usaha",
                "Owner",
                "Plan",
                "Status",
                "Mulai",
                "Action",
              ].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} className="px-5 py-3.5">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              : rows.map((sub, i) => (
                  <tr
                    key={sub.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-gray-400">
                      {(page - 1) * 15 + i + 1}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-gray-800">
                      {sub.usaha.nama_usaha}
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">
                      {sub.usaha.owner.nama_lengkap}
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">
                      {sub.plan.nama_plan}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge
                        variant="outline"
                        className={statusConfig[sub.status].className}
                      >
                        {statusConfig[sub.status].label}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                      {new Date(sub.start_date).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        {/* Detail */}
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 text-xs gap-1"
                          onClick={() => openDetail(sub.id)}
                        >
                          <Eye size={12} /> Detail
                        </Button>

                        {/* Konfirmasi — hanya untuk pending */}
                        {sub.status === "pending" && (
                          <Button
                            size="sm"
                            className="h-7 px-2 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => openKonfirm(sub.id)}
                          >
                            <CheckCircle size={12} /> Konfirmasi
                          </Button>
                        )}

                        {/* Cancel — hanya untuk pending & active */}
                        {(sub.status === "pending" ||
                          sub.status === "active") && (
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-7 px-2 text-xs gap-1"
                            onClick={() => openCancel(sub)}
                          >
                            <XCircle size={12} /> Batalkan
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>

        {/* ── Pagination ── */}
        {!loading && rows.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Halaman {page} dari {lastPage}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-3 text-xs"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft size={14} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-3 text-xs"
                onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                disabled={page === lastPage}
              >
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        )}

        {!loading && rows.length === 0 && (
          <div className="py-16 text-center text-sm text-gray-400">
            Tidak ada data subscription.
          </div>
        )}
      </div>

      {/* ── Dialogs ── */}
      <DetailNewTenantDialog
        subscriptionId={selectedId}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />

      <NewTenantFormDialog
        subscriptionId={selectedId}
        open={konfirmOpen}
        onOpenChange={setKonfirmOpen}
        onSuccess={fetchData}
      />

      <CancelSubscriptionDialog
        subscriptionId={selectedId}
        namaTenant={selectedName}
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        onSuccess={fetchData}
      />
    </div>
  );
}
