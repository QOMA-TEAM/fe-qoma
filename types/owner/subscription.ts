export interface SubscriptionPlan {
  id: string
  nama_plan: string
  harga: number
  batas_outlet: number | 'Unlimited'
  deskripsi: string
}

export interface ActiveSubscription {
  subscription_id: string
  status: string
  start_date: string
  end_date: string | null
  plan: SubscriptionPlan
  penggunaan_outlet: {
    dipakai: number
    maksimal: number | 'Unlimited'
    sisa: number | 'Unlimited'
  }
}

export interface ActiveSubscriptionResponse {
  message: string
  data: ActiveSubscription
}

export interface AvailablePlansResponse {
  message: string
  data: SubscriptionPlan[]
}

export interface UpgradePlanPayload {
  plan_id: string
  metode_pembayaran: string
}
