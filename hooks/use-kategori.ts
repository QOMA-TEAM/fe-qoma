import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { PaginatedKategoriResponse } from "@/types/kategori"

export const useKategori = (page: number = 1, search: string = "", per_page: number = 15) => {
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
