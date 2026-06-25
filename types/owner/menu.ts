export interface MenuBahan {
  id: string
  nama: string
  satuan: string
  pivot: {
    menu_id: string
    bahan_master_id: string
    jumlah_pakai: string
  }
}

export interface MenuKategori {
  id: string
  nama: string
}

export interface MenuMaster {
  id: string
  usaha_id: string
  kategori_id: string
  nama: string
  harga_default: string
  gambar: string | null
  keterangan: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  kategori: MenuKategori
  bahan_masters: MenuBahan[]
  addons?: { id: string, nama: string, harga: string | number }[]
  menu_outlets_count: number
}

export interface PaginatedMenuResponse {
  message: string
  data: MenuMaster[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
  }
}
