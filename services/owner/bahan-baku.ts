import api from "@/lib/axios"
import type { PaginatedBahanResponse } from "@/types/owner/bahan-baku"

export const bahanBakuService = {
  getBahanBaku: async (page: number = 1, search: string = "", per_page: number = 10) => {
    const response = await api.get<PaginatedBahanResponse>("/owner/bahan-baku", {
      params: {
        page,
        per_page,
        ...(search && { search })
      }
    })
    return response.data
  },

  addBahanBaku: async (data: FormData) => {
    const response = await api.post("/owner/bahan-baku", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  updateBahanBaku: async (id: string, data: FormData) => {
    const response = await api.post(`/owner/bahan-baku/${id}?_method=PUT`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  deleteBahanBaku: async (id: string) => {
    const response = await api.post(`/owner/bahan-baku/${id}?_method=DELETE`)
    return response.data
  }
}
