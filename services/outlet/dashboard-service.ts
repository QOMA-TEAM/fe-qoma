import axiosInstance from "@/lib/axios";

export interface OutletProfile {
  id: number;
  nama_outlet: string;
  status_buka: boolean;
}

export interface KeuanganSummary {
  total_pendapatan: number;
  total_pengeluaran: number;
  total_kerugian: number;
  total_keuntungan: number;
  status: string;
}

export interface AlertSummary {
  total: number;
  stok_menipis: number;
  mendekati_expired: number;
  sudah_expired: number;
}

export interface DashboardOutletResponse {
  message: string;
  data: {
    outlet: OutletProfile;
    keuangan_7_hari: KeuanganSummary;
    alert_summary: AlertSummary;
  };
}

export const outletDashboardService = {
  getDashboard: async (): Promise<DashboardOutletResponse> => {
    const response = await axiosInstance.get("/outlet/dashboard");
    return response.data;
  },

  toggleStatus: async (): Promise<{ message: string; status_buka: boolean }> => {
    const response = await axiosInstance.patch("/outlet/toggle-status");
    return response.data;
  },
};
