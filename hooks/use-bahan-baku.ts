import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { PaginatedBahanResponse, BahanMaster } from "@/types/bahan-baku"

export const useBahanBaku = (page: number = 1, search: string = "", per_page: number = 10) => {
  return useQuery({
    queryKey: ["bahan-baku", page, search, per_page],
    queryFn: async () => {
      const response = await api.get<PaginatedBahanResponse>("/owner/bahan-baku", {
        params: {
          page,
          per_page,
          ...(search && { search })
        }
      })
      return response.data
    }
  })
}

export const useAddBahanBaku = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = await api.post("/owner/bahan-baku", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bahan-baku"] })
    },
  })
}

export const useUpdateBahanBaku = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FormData }) => {
      // POST with _method=PUT to handle multipart/form-data correctly in Laravel
      const response = await api.post(`/owner/bahan-baku/${id}?_method=PUT`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bahan-baku"] })
    },
  })
}

export const useDeleteBahanBaku = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      // Menggunakan POST dengan _method=DELETE untuk menghindari error PHP 8.2 (request_parse_body)
      const response = await api.post(`/owner/bahan-baku/${id}?_method=DELETE`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bahan-baku"] })
    },
  })
}
