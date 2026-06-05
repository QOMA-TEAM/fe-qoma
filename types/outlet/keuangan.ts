export interface OutletKeuanganCards {
  total_pendapatan: number
  total_pengeluaran: number
  total_kerugian: number
  total_keuntungan: number
  status: "untung" | "rugi"
  selisih: number
  pesan: string
}

export interface OutletKeuanganGrafik {
  tanggal: string
  total_pendapatan: number
  total_pengeluaran: number
  total_kerugian: number
  total_keuntungan: number
  status: "untung" | "rugi"
}

export interface OutletKeuanganTransaksi {
  id: string
  tipe: "pendapatan" | "pengeluaran" | "kerugian"
  keterangan: string
  nominal: number
  tanggal: string
  waktu: string
}

export interface OutletKeuanganResponse {
  message: string
  filter: {
    range: string
    dari: string
    sampai: string
  }
  data: {
    cards: OutletKeuanganCards
    grafik: OutletKeuanganGrafik[]
    transaksi: OutletKeuanganTransaksi[]
  }
}
