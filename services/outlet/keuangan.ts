import api from "@/lib/axios"
import type { OutletKeuanganResponse } from "@/types/outlet/keuangan"

export const outletKeuanganService = {
  get: async (range: string = "7days") => {
    const params = new URLSearchParams({ range })
    const { data } = await api.get<OutletKeuanganResponse>(`/outlet/keuangan?${params}`)
    return data
  },
}
