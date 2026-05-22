export interface KategoriMaster {
  id: string
  usaha_id: string
  nama: string
  created_at: string
  updated_at: string
  menus_count: number
}

export interface PaginatedKategoriResponse {
  message: string
  data: KategoriMaster[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
  }
}
