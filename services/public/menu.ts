import api from "@/lib/axios"
import type { ValidasiMejaResponse, PublicMenuResponse, PublicMenuDetailResponse } from "@/types/public/menu"

export const publicMenuService = {
  validasiMeja: async (outletId: string, mejaId: string) => {
    const { data } = await api.get<ValidasiMejaResponse>(`/public/validasi-meja?outlet_id=${outletId}&meja_id=${mejaId}`)
    return data.data
  },

  getPublicMenus: async (outletId: string) => {
    const { data } = await api.get<PublicMenuResponse>(`/public/menu?outlet_id=${outletId}`)
    return data.data
  },

  getPublicMenuDetail: async (menuId: string, outletId: string) => {
    const { data } = await api.get<PublicMenuDetailResponse>(`/public/menu/${menuId}?outlet_id=${outletId}`)
    return data.data
  }
}
