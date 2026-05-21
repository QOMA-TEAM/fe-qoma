export interface Plan {
  id: string
  nama_plan: string
  harga: number
  batas_outlet: number | "Unlimited"
  durasi_hari: number
  deskripsi: string | null
  subscriptions_count?: number
}

export interface PlanListResponse {
  message: string
  data: Plan[]
}

export interface PlanDetailResponse {
  message: string
  data: Plan
}
