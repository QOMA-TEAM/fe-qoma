import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { approvalBahanService } from "@/services/owner/approval-bahan"

export const useGetApprovalBahan = (
  page: number = 1,
  status?: string,
  outlet_id?: string,
  per_page: number = 10
) => {
  return useQuery({
    queryKey: ["approval-bahan", page, status, outlet_id, per_page],
    queryFn: () => approvalBahanService.getApprovalBahan(page, status, outlet_id, per_page),
  })
}

export const useApproveBahan = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, catatan }: { id: string; catatan?: string }) =>
      approvalBahanService.approve(id, catatan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["approval-bahan"] })
    },
  })
}

export const useRejectBahan = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, catatan }: { id: string; catatan: string }) =>
      approvalBahanService.reject(id, catatan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["approval-bahan"] })
    },
  })
}
