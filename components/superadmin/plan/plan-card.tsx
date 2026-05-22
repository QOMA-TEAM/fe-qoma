"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Store } from "lucide-react";
import { Plan } from "@/types/plan";

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
  const isActive = plan.status === "active";

  return (
    <Card className="w-full max-w-[280px] border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white rounded-xl overflow-hidden">
      <CardContent className="p-5 space-y-4">
        {/* Header: Nama Plan + Status Badge */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            {plan.nama_plan}
          </h3>
          <Badge
            variant="outline"
            className={
              isActive
                ? "border-teal-400 text-teal-600 bg-teal-50 rounded-full px-3 text-xs font-medium"
                : "border-gray-300 text-gray-500 bg-gray-50 rounded-full px-3 text-xs font-medium"
            }
          >
            {isActive ? "Aktif" : "Tidak Aktif"}
          </Badge>
        </div>

        {/* Harga */}
        <div>
          <p className="text-2xl font-bold text-gray-900 tracking-tight">
            {formatRupiah(plan.harga)}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Per {plan.tagihan}</p>
        </div>

        <Separator className="bg-gray-100" />

        {/* Features */}
        <ul className="space-y-1.5">
          <li className="flex items-center gap-2 text-sm text-gray-600">
            <Store className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
            <span>{plan.batas_outlet} Outlet</span>
          </li>
          {plan.deskripsi && (
            <li className="text-xs text-gray-400 leading-relaxed">
              {plan.deskripsi}
            </li>
          )}
        </ul>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button
            size="sm"
            onClick={() => onEdit(plan)}
            className="flex-1 h-8 text-xs bg-blue-700 hover:bg-blue-800 text-white rounded-md"
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(plan)}
            className="flex-1 h-8 text-xs rounded-md"
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
          <div className="h-5 w-14 bg-gray-100 rounded-full animate-pulse" />
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
