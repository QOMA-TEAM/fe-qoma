"use client"

import { Badge } from "@/components/ui/badge"
import { useActiveSubscription } from "@/hooks/owner/use-subscription"
import { Store, CheckCircle2 } from "lucide-react"
import { PlanCard } from "@/components/ui/plan-card"

export function ActivePlanCard() {
  const { data: activeSub } = useActiveSubscription()

  if (!activeSub) return null

  const isPending = activeSub.status === 'pending'

  return (
    <PlanCard
      name={activeSub.plan.nama_plan}
      price={activeSub.plan.harga}
      period="30 Hari"
      description="Mengelola operasional bisnis Anda dengan efisien"
      className="max-w-sm"
      headerBadge={
        isPending ? (
          <Badge variant="outline" className="rounded-full px-3 text-xs font-medium py-1 border-yellow-400 text-yellow-600 bg-yellow-50">
            Pending
          </Badge>
        ) : undefined
      }
      features={[
        {
          icon: <Store className="w-4 h-4 text-gray-400" />,
          text: activeSub.plan.batas_outlet === 'Unlimited' ? 'Unlimited Outlet' : `${activeSub.plan.batas_outlet} Outlet`
        },
        {
          icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
          text: `Telah digunakan: ${activeSub.penggunaan_outlet.dipakai} Outlet`
        }
      ]}
      actionButton={
        <button disabled className="w-full text-sm font-semibold py-3 px-4 rounded-xl border border-gray-300 text-gray-700 bg-transparent">
          {isPending ? 'Menunggu Pembayaran' : 'Paket Anda saat ini'}
        </button>
      }
    />
  )
}
