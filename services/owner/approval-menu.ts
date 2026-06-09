import axiosInstance from "@/lib/axios"

export interface Outlet {
  id: string
  nama_outlet: string
}

export interface MenuMaster {
  id: string
  nama: string
}

export interface MenuOutlet {
  id: string
  menu: MenuMaster
}

export interface ApprovalMenu {
  id: string
  menu_outlet_id: string
  outlet_id: string
  usaha_id: string
  harga_lama: number
  harga_baru: number
  alasan: string
  status: "pending" | "approved" | "rejected"
  catatan_owner: string | null
  diproses_at: string | null
  created_at: string
  updated_at: string
  outlet?: Outlet
  menu_outlet?: MenuOutlet
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export const approvalMenuService = {
  getApprovalMenu: async (
    page: number = 1,
    status?: string,
    outlet_id?: string,
    per_page: number = 10
  ) => {
    const params = new URLSearchParams()
    params.append("page", page.toString())
    params.append("per_page", per_page.toString())
    if (status) params.append("status", status)
    if (outlet_id) params.append("outlet_id", outlet_id)

    const response = await axiosInstance.get(`/owner/approval-harga?${params.toString()}`)
    return response.data as PaginatedResponse<ApprovalMenu>
  },

  approve: async (id: string, catatan?: string) => {
    const response = await axiosInstance.post(`/owner/approval-harga/${id}/approve`, {
      catatan,
    })
    return response.data
  },

  reject: async (id: string, catatan: string) => {
    const response = await axiosInstance.post(`/owner/approval-harga/${id}/reject`, {
      catatan,
    })
    return response.data
  },
}
