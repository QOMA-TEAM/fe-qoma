import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { PaginatedMenuResponse } from "@/types/menu"

export const useMenu = (
  page: number = 1, 
  search: string = "", 
  kategori_id: string = "", 
  is_active: string = ""
) => {
  return useQuery({
    queryKey: ["menu", page, search, kategori_id, is_active],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        ...(search && { search }),
        ...(kategori_id && { kategori_id }),
        ...(is_active && { is_active }),
      })
      const response = await api.get<PaginatedMenuResponse>(`/owner/menu?${params}`)
      return response.data
    },
  })
}

export const useAddMenu = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = await api.post("/owner/menu", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu"] })
    },
  })
}

export const useUpdateMenu = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FormData }) => {
      const response = await api.post(`/owner/menu/${id}?_method=PUT`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu"] })
    },
  })
}

export const useDeleteMenu = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post(`/owner/menu/${id}?_method=DELETE`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu"] })
    },
  })
}
