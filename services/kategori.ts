import api from "@/lib/axios"
import type { PaginatedKategoriResponse } from "@/types/kategori"

export const kategoriService = {
  getKategori: async (page: number = 1, search: string = "", per_page: number = 10) => {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: per_page.toString(),
      ...(search && { search }),
    })
    const response = await api.get<PaginatedKategoriResponse>(`/owner/kategori?${params}`)
    return response.data
  },

  addKategori: async (nama: string) => {
    const { data } = await api.post("/owner/kategori", { nama })
    return data
  },

  updateKategori: async (id: string, nama: string) => {
    const { data } = await api.post(`/owner/kategori/${id}`, { nama, _method: 'PUT' })
    return data
  },

  deleteKategori: async (id: string) => {
    const { data } = await api.post(`/owner/kategori/${id}`, { _method: 'DELETE' })
    return data
  }
}
