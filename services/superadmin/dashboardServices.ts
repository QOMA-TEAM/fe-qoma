import api from "@/lib/axios";

export const dashboardService = {
    getStats: async () => {
        const response = await api.get("/super-admin/dashboard");
        return response.data;
    },

    /**
     * Ambil data MRR graph
     * @param {'daily'|'weekly'|'monthly'} filter
     * Response: { filter, label, data: [{ tanggal/bulan, total, jumlah_subscriber }] }
     */
    getMRR: async (filter = "monthly") => {
        const response = await api.get("/super-admin/dashboard/mrr", {
            params: { filter },
        });
        return response.data;
    },
};
