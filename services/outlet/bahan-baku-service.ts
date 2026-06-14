import axiosInstance from "@/lib/axios";

export interface BahanMaster {
  id: string;
  nama: string;
  satuan: string;
  harga_default?: string | number;
  gambar: string | null;
}

export interface BahanOutlet {
  id: string;
  stok: number;
  stok_minimum: number;
  batch_terdekat_expired: {
    sisa: number;
    expired_date: string | null;
    tanggal_masuk: string | null;
  } | null;
  batch_aktif: {
    id: string;
    jumlah_awal: number;
    sisa: number;
    expired_date: string | null;
    tanggal_masuk: string | null;
    mendekati_expired: boolean;
    sudah_expired: boolean;
  }[];
  is_menipis: boolean;
  is_mendekati_expired: boolean;
  is_sudah_expired: boolean;
  bahan_master: BahanMaster;
}

export interface BahanOutletResponse {
  data: BahanOutlet[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface BahanMasterResponse {
  data: BahanMaster[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export const bahanBakuService = {
  getMasterList: async (params?: {
    page?: number;
    search?: string;
  }): Promise<BahanMasterResponse> => {
    const response = await axiosInstance.get("/outlet/bahan-master", { params });
    return response.data;
  },

  getList: async (params?: {
    page?: number;
    search?: string;
    satuan?: string;
    sort_by?: string;
    sort_dir?: string;
  }): Promise<BahanOutletResponse> => {
    const response = await axiosInstance.get("/outlet/bahan-baku", { params });
    return response.data;
  },

  restock: async (data: {
    bahan_master_id: string;
    jumlah: number;
    tanggal_kadaluarsa: string | null;
    total_pengeluaran?: number;
  }) => {
    const response = await axiosInstance.post("/outlet/bahan-baku", data);
    return response.data;
  },

  ajukanPerubahanHarga: async (data: {
    bahan_outlet_id: string;
    harga_baru: number;
    alasan: string;
  }) => {
    const response = await axiosInstance.post("/outlet/approval-harga-bahan", data);
    return response.data;
  },
};
