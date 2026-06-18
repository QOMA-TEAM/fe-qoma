"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Store, XCircle } from "lucide-react";
import { Plan } from "@/types/superadmin/plan";
import { PlanCard as GlobalPlanCard } from "@/components/ui/plan-card";
import { formatRupiah } from "@/lib/utils";

interface PlanCardProps {
  plan: Plan;
  allVariants?: Plan[];
  onEdit: (plan: Plan) => void;
  onDelete: (group: Plan[]) => void;
}

export function PlanCard({ plan, allVariants, onEdit, onDelete }: PlanCardProps) {
  const isActive = plan.status === "aktif";

  const minPrice = allVariants && allVariants.length > 0
    ? Math.min(...allVariants.map((v) => v.harga))
    : plan.harga;

  return (
    <div className="w-[280px] shrink-0">
    <GlobalPlanCard
      name={plan.nama_plan}
      price={minPrice}
      period={(!allVariants || allVariants.length === 0) ? plan.tagihan : undefined}
      description={plan.deskripsi || undefined}
      isActive={isActive}
      className="h-full"
      headerBadge={
        <Badge
          variant="outline"
          className={`
            flex items-center gap-1 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium border-none
            ${isActive
              ? "text-[#1D5E84] bg-[#1D5E84]/10"
              : "text-gray-400 bg-gray-100"
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
      }
      priceSubtext={
        allVariants && allVariants.length > 0 ? (
          <div>
            <p className="text-xs text-gray-400 mb-1">Mulai dari</p>
            <div className="flex flex-wrap gap-1.5">
              {allVariants.map((v) => (
                <Badge key={v.id} variant="secondary" className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0 border-none font-semibold">
                  {v.tagihan}
                </Badge>
              ))}
            </div>
          </div>
        ) : undefined
      }
      features={[
        {
          icon: <Store className="h-4 w-4" />,
          text: `${plan.batas_outlet} Outlet`
        }
      ]}
      actionButton={
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => onEdit(plan)}
            className="flex-1 h-8 text-xs bg-[#1D5E84] hover:bg-[#154663] text-white rounded-md transition-colors"
          >
            Edit
          </Button>
          <Button
            size="sm"
            onClick={() => onDelete(allVariants || [plan])}
            className="flex-1 h-8 text-xs bg-[#C92A2A] hover:bg-[#A12121] text-white rounded-md transition-colors"
          >
            Hapus
          </Button>
        </div>
      }
    />
    </div>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

export function PlanCardSkeleton() {
  return (
    <div className="w-[280px] shrink-0">
      <Card className="w-full border border-gray-200 rounded-2xl overflow-hidden">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="h-6 w-28 bg-gray-100 rounded animate-pulse" />
            <div className="h-5 w-16 bg-gray-100 rounded-full animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-9 w-36 bg-gray-100 rounded animate-pulse" />
            <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
          </div>
          <Separator className="bg-gray-100" />
          <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
          <div className="flex gap-2">
            <div className="flex-1 h-8 bg-gray-100 rounded animate-pulse" />
            <div className="flex-1 h-8 bg-gray-100 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}