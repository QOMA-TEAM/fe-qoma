import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { PaginatedResponse, Outlet } from "@/types/outlet"

export const useOutlets = (page: number = 1, search: string = "") => {
  return useQuery({
    queryKey: ["outlets", page, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        ...(search && { search }),
      })
      const response = await api.get<PaginatedResponse<Outlet>>(`/owner/outlet?${params}`)
      return response.data
    }
  })
}

export const useAddOutlet = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ usahaId, data }: { usahaId: string; data: any }) => {
      const response = await api.post(`/owner/usaha/${usahaId}/outlet`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outlets"] })
    },
  })
}

