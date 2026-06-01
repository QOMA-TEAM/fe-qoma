export interface DashboardRingkasan {
  total_outlet: number
  total_pendapatan: number
  total_pengeluaran: number
  total_kerugian: number
  total_keuntungan: number
  status_keuangan: string
}

export interface DashboardSubscription {
  plan: string
  batas_outlet: number | 'Unlimited'
  sisa_outlet: number | 'Unlimited'
  end_date: string
}

export interface DashboardOutletList {
  id: string
  nama_outlet: string
  alamat: string | null
  status_buka: 'buka' | 'tutup'
}

export interface DashboardResponse {
  message: string
  data: {
    ringkasan: DashboardRingkasan
    subscription: DashboardSubscription | null
    outlet_list: DashboardOutletList[]
  }
}

export interface GraphDataPoint {
  tanggal: string
  total_pendapatan: number
  total_pengeluaran: number
  total_kerugian: number
  total_keuntungan: number
}

export interface DashboardGraphResponse {
  message: string
  data: {
    outlet_id?: string
    range?: string
    // if outlet_id is present
    summary?: {
      total_pendapatan: number
      total_pengeluaran: number
      total_kerugian: number
      total_keuntungan: number
    }
    // if outlet_id is NOT present
    total_pendapatan?: number
    total_pengeluaran?: number
    total_kerugian?: number
    total_keuntungan?: number
    status?: string
    per_outlet?: {
      outlet_id: string
      nama_outlet: string
      total_pendapatan: number
      total_pengeluaran: number
      total_kerugian: number
      total_keuntungan: number
      grafik: GraphDataPoint[]
    }[]

    grafik?: GraphDataPoint[]
  }
}

export interface ActivityLogItem {
  id: string
  aktivitas: string
  deskripsi: string
  created_at: string
  user?: {
    id: string
    username: string
    nama_lengkap: string | null
  }
}

export interface PaginatedActivityLogResponse {
  message: string
  data: ActivityLogItem[]
  meta: {
    current_page: number
    per_page: number
    total: number
    last_page: number
    from: number | null
    to: number | null
  }
}
