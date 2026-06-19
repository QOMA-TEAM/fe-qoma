export interface KeuanganSummary {
  total_pendapatan: number
  total_pengeluaran: number
  total_kerugian: number
  total_keuntungan: number
}

export interface KeuanganSummaryResponse {
  message: string
  filter: {
    range: string
    dari: string
    sampai: string
    outletId: string | null
  }
  data: KeuanganSummary
}

export interface KeuanganTransaction {
  id: string
  tipe: "pendapatan" | "pengeluaran" | "kerugian"
  outlet: string
  keterangan: string
  nominal: number
  tanggal: string
  waktu?: string
}

export interface KeuanganListResponse {
  message: string
  data: KeuanganTransaction[]
  meta: {
    current_page: number
    per_page: number
    total: number
    last_page: number
    from: number | null
    to: number | null
  }
}
