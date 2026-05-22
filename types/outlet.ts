export interface OutletUser {
  id: string
  outlet_id: string
  username: string
  is_active: number | boolean
}

export interface Outlet {
  id: string
  usaha_id: string
  nama_outlet: string
  alamat: string | null
  email: string | null
  mejas_count: number
  users: OutletUser[]
  created_at?: string
  updated_at?: string
}

export interface PaginatedResponse<T> {
  message: string
  data: T[]
  meta: {
    current_page: number
    per_page: number
    total: number
    last_page: number
    from: number | null
    to: number | null
  }
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
}
