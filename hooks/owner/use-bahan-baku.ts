import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { bahanBakuService } from "@/services/owner/bahan-baku"

export const useBahanBaku = (page: number = 1, search: string = "", per_page: number = 10) => {
  return useQuery({
    queryKey: ["bahan-baku", page, search, per_page],
    queryFn: () => bahanBakuService.getBahanBaku(page, search, per_page),
  })
}

export const useAddBahanBaku = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: FormData) => bahanBakuService.addBahanBaku(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bahan-baku"] })
    },
  })
}

export const useUpdateBahanBaku = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => bahanBakuService.updateBahanBaku(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bahan-baku"] })
    },
  })
}

export const useDeleteBahanBaku = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => bahanBakuService.deleteBahanBaku(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bahan-baku"] })
    },
  })
}
