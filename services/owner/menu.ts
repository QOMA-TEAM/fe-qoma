import api from "@/lib/axios"
import type { PaginatedMenuResponse } from "@/types/owner/menu"

export const menuService = {
  getMenu: async (
    page: number = 1,
    search: string = "",
    kategori_id: string = "",
    is_active: string = ""
  ) => {
    const params = new URLSearchParams({
      page: page.toString(),
      ...(search && { search }),
      ...(kategori_id && { kategori_id }),
      ...(is_active && { is_active }),
    })
    const response = await api.get<PaginatedMenuResponse>(`/owner/menu?${params}`)
    return response.data
  },

  addMenu: async (data: FormData) => {
    const response = await api.post("/owner/menu", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  updateMenu: async (id: string, data: FormData) => {
    const response = await api.post(`/owner/menu/${id}?_method=PUT`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  deleteMenu: async (id: string) => {
    const response = await api.post(`/owner/menu/${id}?_method=DELETE`)
    return response.data
  }
}
