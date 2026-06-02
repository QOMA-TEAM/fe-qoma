// components/superadmin/plan/plan-card.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Store, XCircle } from "lucide-react";
import { Plan } from "@/types/superadmin/plan";

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace("IDR", "Rp.");
}

interface PlanCardProps {
  plan: Plan;
  onEdit: (plan: Plan) => void;
  onDelete: (plan: Plan) => void;
}

export function PlanCard({ plan, onEdit, onDelete }: PlanCardProps) {
  const isActive = plan.status === "aktif";   // ← sesuai PlanStatus

  return (
    <Card
      className={`
        w-full max-w-[280px] border shadow-sm hover:shadow-md transition-all duration-200
        rounded-xl overflow-hidden
        ${isActive
          ? "border-[#1D5E84]/40 bg-white"           // aktif: border primary blue
          : "border-gray-200 bg-gray-50 opacity-75"  // tidak aktif: redup
        }
      `}
    >


      <CardContent className="p-5 space-y-4">
        {/* Header: Nama Plan + Status Badge */}
        <div className="flex items-center justify-between gap-2">
          <h3
            className={`text-base font-semibold truncate ${isActive ? "text-gray-800" : "text-gray-400"
              }`}
          >
            {plan.nama_plan}
          </h3>

          <Badge
            variant="outline"
            className={`
              flex items-center gap-1 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium
              ${isActive
                ? "border-[#1D5E84]/20 text-[#1D5E84] bg-[#1D5E84]/10"
                : "border-gray-300 text-gray-400 bg-gray-100"
              }
            `}
          >
            {isActive ? (
              <CheckCircle2 className="h-3 w-3 text-[#1D5E84]" />
            ) : (
              <XCircle className="h-3 w-3 text-gray-400" />
            )}
            {isActive ? "Aktif" : "Tidak Aktif"}
          </Badge>
        </div>

        {/* Harga */}
        <div>
          <p
            className={`text-2xl font-bold tracking-tight ${isActive ? "text-gray-900" : "text-gray-400"
              }`}
          >
            {formatRupiah(plan.harga)}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Per {plan.tagihan}</p>
        </div>

        <Separator className={isActive ? "bg-gray-100" : "bg-gray-200"} />

        {/* Features */}
        <ul className="space-y-1.5">
          <li className="flex items-center gap-2 text-sm text-gray-600">
            <Store
              className={`h-3.5 w-3.5 flex-shrink-0 ${isActive ? "text-[#1D5E84]" : "text-gray-300"
                }`}
            />
            <span className={isActive ? "text-gray-600" : "text-gray-400"}>
              {plan.batas_outlet} Outlet
            </span>
          </li>
          {plan.deskripsi && (
            <li className="text-xs text-gray-400 leading-relaxed line-clamp-2">
              {plan.deskripsi}
            </li>
          )}
        </ul>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button
            size="sm"
            onClick={() => onEdit(plan)}
            className="flex-1 h-8 text-xs bg-[#1D5E84] hover:bg-[#154663] text-white rounded-md transition-colors"
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(plan)}
            className="flex-1 h-8 text-xs rounded-md transition-colors"
          >
            Hapus
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

export function PlanCardSkeleton() {
  return (
    <Card className="w-full max-w-[280px] border border-gray-200 rounded-xl overflow-hidden">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-5 w-24 bg-gray-100 rounded animate-pulse" />
          <div className="h-5 w-16 bg-gray-100 rounded-full animate-pulse" />
        </div>
        <div className="space-y-1.5">
          <div className="h-8 w-32 bg-gray-100 rounded animate-pulse" />
          <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
        </div>
        <Separator className="bg-gray-100" />
        <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
        <div className="flex gap-2">
          <div className="flex-1 h-8 bg-gray-100 rounded animate-pulse" />
          <div className="flex-1 h-8 bg-gray-100 rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}