export interface BahanMaster {
  id: string
  usaha_id: string
  nama: string
  satuan: string
  harga_default: string // from API usually string for decimal/numeric
  gambar: string | null
  created_at: string
  updated_at: string
}

export interface PaginatedBahanResponse {
  message: string
  data: BahanMaster[]
  meta: {
    current_page: number
    per_page: number
    total: number
    last_page: number
    from: number
    to: number
  }
}
