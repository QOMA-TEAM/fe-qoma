import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { KeuanganSummaryResponse, KeuanganListResponse } from "@/types/keuangan"

export const useKeuanganSummary = (range: string = "7days", outletId?: string) => {
  return useQuery({
    queryKey: ["keuangan-summary", range, outletId],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (range) params.append("range", range)
      if (outletId) params.append("outlet_id", outletId)

      const { data } = await api.get<KeuanganSummaryResponse>(`/owner/keuangan?${params}`)
      return data
    },
  })
}

export const useKeuanganList = (
  page: number = 1,
  range: string = "7days",
  tipe: string = "semua",
  outletId?: string,
  per_page: number = 10
) => {
  return useQuery({
    queryKey: ["keuangan-list", page, range, tipe, outletId, per_page],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        range: range,
        tipe: tipe,
        per_page: per_page.toString(),
      })
      if (outletId) params.append("outlet_id", outletId)

      const { data } = await api.get<KeuanganListResponse>(`/owner/keuangan/list?${params}`)
      return data
    },
  })
}
