import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { PaginatedKategoriResponse, KategoriMaster } from "@/types/kategori"

export const useKategori = (page: number = 1, search: string = "", per_page: number = 10) => {
  return useQuery({
    queryKey: ["kategori", page, search, per_page],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: per_page.toString(),
        ...(search && { search }),
      })
      const response = await api.get<PaginatedKategoriResponse>(`/owner/kategori?${params}`)
      return response.data
    },
  })
}

export const useAddKategori = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (nama: string) => {
      const { data } = await api.post("/owner/kategori", { nama })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kategori"] })
    },
  })
}

export const useUpdateKategori = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, nama }: { id: string; nama: string }) => {
      const { data } = await api.post(`/owner/kategori/${id}`, { nama, _method: 'PUT' })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kategori"] })
    },
  })
}

export const useDeleteKategori = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post(`/owner/kategori/${id}`, { _method: 'DELETE' })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kategori"] })
    },
  })
}
