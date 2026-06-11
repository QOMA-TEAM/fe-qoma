import api from "@/lib/axios"
import type { ValidasiMejaResponse } from "@/types/public/menu"

export const publicMenuService = {
  validasiMeja: async (outletId: string, mejaId: string) => {
    const { data } = await api.get<ValidasiMejaResponse>(`/public/validasi-meja?outlet_id=${outletId}&meja_id=${mejaId}`)
    return data.data
  }
}
