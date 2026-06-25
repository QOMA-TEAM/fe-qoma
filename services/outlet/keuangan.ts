import api from "@/lib/axios"
import type { OutletKeuanganResponse } from "@/types/outlet/keuangan"

export const outletKeuanganService = {
  get: async (range: string = "7days", page: number = 1, tipe: string = "semua") => {
    const params = new URLSearchParams({ range, page: page.toString(), tipe })
    const { data } = await api.get<OutletKeuanganResponse>(`/outlet/keuangan?${params}`)
    return data
  },
}
