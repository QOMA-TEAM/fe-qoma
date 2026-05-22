import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { PlanListResponse, Plan } from "@/types/plan"

// ── Super Admin ──

export const usePlans = () => {
  return useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const response = await api.get<PlanListResponse>("/super-admin/plans")
      return response.data
    },
  })
}

export const useAddPlan = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { nama_plan: string; harga: number; batas_outlet: number; durasi_hari: number; deskripsi?: string }) => {
      const res = await api.post("/super-admin/plans", data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] })
    },
  })
}

export const useUpdatePlan = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string; nama_plan?: string; harga?: number; batas_outlet?: number; durasi_hari: number; deskripsi?: string }) => {
      const res = await api.put(`/super-admin/plans/${id}`, data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] })
    },
  })
}

export const useDeletePlan = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/super-admin/plans/${id}`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] })
    },
  })
}

// ── Owner ──

export const useOwnerAvailablePlans = () => {
  return useQuery({
    queryKey: ["owner", "available-plans"],
    queryFn: async () => {
      const response = await api.get<PlanListResponse>("/owner/subscription/plans")
      return response.data
    },
  })
}

export const useOwnerSubscription = () => {
  return useQuery({
    queryKey: ["owner", "subscription"],
    queryFn: async () => {
      const response = await api.get("/owner/subscription")
      return response.data
    },
  })
}

export const useUpgradePlan = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { plan_id: string; metode_pembayaran: string }) => {
      const res = await api.post("/owner/subscription/upgrade", data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner", "subscription"] })
      queryClient.invalidateQueries({ queryKey: ["owner", "available-plans"] })
    },
  })
}
