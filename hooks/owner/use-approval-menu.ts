import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { approvalMenuService } from "@/services/owner/approval-menu"

export const useGetApprovalMenu = (
  page: number = 1,
  status?: string,
  outlet_id?: string,
  per_page: number = 10
) => {
  return useQuery({
    queryKey: ["approval-menu", page, status, outlet_id, per_page],
    queryFn: () => approvalMenuService.getApprovalMenu(page, status, outlet_id, per_page),
  })
}

export const useApproveMenu = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, catatan }: { id: string; catatan?: string }) =>
      approvalMenuService.approve(id, catatan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["approval-menu"] })
    },
  })
}

export const useRejectMenu = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, catatan }: { id: string; catatan: string }) =>
      approvalMenuService.reject(id, catatan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["approval-menu"] })
    },
  })
}
