import api from "@/lib/axios"
import type { KeuanganSummaryResponse, KeuanganListResponse } from "@/types/keuangan"

export const keuanganService = {
  getSummary: async (range: string = "7days", outletId?: string) => {
    const params = new URLSearchParams()
    if (range) params.append("range", range)
    if (outletId) params.append("outlet_id", outletId)

    const { data } = await api.get<KeuanganSummaryResponse>(`/owner/keuangan?${params}`)
    return data
  },
  
  getList: async (
    page: number = 1,
    range: string = "7days",
    tipe: string = "semua",
    outletId?: string,
    per_page: number = 10
  ) => {
    const params = new URLSearchParams({
      page: page.toString(),
      range: range,
      tipe: tipe,
      per_page: per_page.toString(),
    })
    if (outletId) params.append("outlet_id", outletId)

    const { data } = await api.get<KeuanganListResponse>(`/owner/keuangan/list?${params}`)
    return data
  }
}
