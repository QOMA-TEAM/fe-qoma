import api from "@/lib/axios"
import type { PaginatedResponse, Outlet } from "@/types/owner/outlet"

export const outletService = {
  getOutlets: async (page: number = 1, search: string = "") => {
    const params = new URLSearchParams({
      page: page.toString(),
      ...(search && { search }),
    })
    const response = await api.get<PaginatedResponse<Outlet>>(`/owner/outlet?${params}`)
    return response.data
  },

  addOutlet: async (usahaId: string, data: any) => {
    const response = await api.post(`/owner/usaha/${usahaId}/outlet`, data)
    return response.data
  }
}
