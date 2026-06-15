import api from "@/lib/axios"

export interface PaginatedResponse<T> {
  message?: string
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface Addon {
  id: string
  usaha_id: string
  nama: string
  harga: number
  created_at: string
  updated_at: string
}

export interface AddonPayload {
  nama: string
  harga: number
}

export const addonService = {
  getAddons: async (page = 1, perPage = 10): Promise<PaginatedResponse<Addon>> => {
    const { data } = await api.get(`/owner/addon`, {
      params: { page, per_page: perPage }
    })
    return data
  },

  createAddon: async (payload: AddonPayload) => {
    const { data } = await api.post(`/owner/addon`, payload)
    return data
  },

  updateAddon: async (id: string, payload: AddonPayload) => {
    const { data } = await api.put(`/owner/addon/${id}`, payload)
    return data
  },

  deleteAddon: async (id: string) => {
    const { data } = await api.delete(`/owner/addon/${id}`)
    return data
  }
}
