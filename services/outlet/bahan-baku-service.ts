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
  tanggal_masuk: string | null;
  tanggal_kadaluarsa: string | null;
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

export const bahanBakuService = {
  getList: async (params?: {
    page?: number;
    search?: string;
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
  }) => {
    const response = await axiosInstance.post("/outlet/bahan-baku", data);
    return response.data;
  },
};
