import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/axios"

export interface SubscriptionPlan {
  id: string
  nama_plan: string
  harga: number
  batas_outlet: number | 'Unlimited'
  deskripsi: string
}

export interface ActiveSubscription {
  subscription_id: string
  status: string
  start_date: string
  end_date: string | null
  plan: SubscriptionPlan
  penggunaan_outlet: {
    dipakai: number
    maksimal: number | 'Unlimited'
    sisa: number | 'Unlimited'
  }
}

export interface ActiveSubscriptionResponse {
  message: string
  data: ActiveSubscription
}

export interface AvailablePlansResponse {
  message: string
  data: SubscriptionPlan[]
}

export const useActiveSubscription = () => {
  return useQuery({
    queryKey: ["active-subscription"],
    queryFn: async () => {
      const { data } = await api.get<ActiveSubscriptionResponse>("/owner/subscription")
      return data.data
    },
  })
}

export const useAvailablePlans = () => {
  return useQuery({
    queryKey: ["available-plans"],
    queryFn: async () => {
      const { data } = await api.get<AvailablePlansResponse>("/owner/subscription/plans")
      return data.data
    },
  })
}

export const useUpgradePlan = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ plan_id, metode_pembayaran }: { plan_id: string; metode_pembayaran: string }) => {
      const { data } = await api.post("/owner/subscription/upgrade", { plan_id, metode_pembayaran })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["active-subscription"] })
      queryClient.invalidateQueries({ queryKey: ["available-plans"] })
    },
  })
}
