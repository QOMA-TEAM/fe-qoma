import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pesananService } from "@/services/outlet/pesanan-service";
import { toast } from "sonner";

export const PESANAN_QUERY_KEY = ["outletPesananList"];
export const PESANAN_DETAIL_QUERY_KEY = (id: string) => ["outletPesananDetail", id];

export function usePesananList(status?: string) {
  return useQuery({
    queryKey: [...PESANAN_QUERY_KEY, status],
    queryFn: () => pesananService.getList(status),
    refetchInterval: 15000, // Auto refetch tiap 15 detik agar pesanan baru terlihat
  });
}

export function usePesananDetail(id: string) {
  return useQuery({
    queryKey: PESANAN_DETAIL_QUERY_KEY(id),
    queryFn: () => pesananService.getDetail(id),
    enabled: !!id,
    refetchInterval: 15000,
  });
}

export function useKonfirmasiPesanan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: pesananService.konfirmasi,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: PESANAN_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PESANAN_DETAIL_QUERY_KEY(data.data.id) });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal mengkonfirmasi pesanan");
    },
  });
}

export function useBayarPesanan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, metode }: { id: string; metode: "tunai" | "transfer" | "qris" }) => 
      pesananService.bayar(id, metode),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: PESANAN_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PESANAN_DETAIL_QUERY_KEY(data.data.id) });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal memproses pembayaran");
    },
  });
}

export function useTambahItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, items }: { id: string; items: Array<{ menu_id: string; qty: number }> }) =>
      pesananService.tambahItem(id, items),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: PESANAN_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PESANAN_DETAIL_QUERY_KEY(data.data.id) });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal menambahkan item pesanan");
    },
  });
}

export function useUpdateQtyItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, detailId, qty }: { id: string; detailId: string; qty: number }) =>
      pesananService.updateQty(id, detailId, qty),
    onSuccess: (data) => {
      // toast.success(data.message); // Bisa di-comment agar tidak spam toast saat klik berulang
      queryClient.invalidateQueries({ queryKey: PESANAN_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PESANAN_DETAIL_QUERY_KEY(data.data.id) });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal mengubah jumlah pesanan");
    },
  });
}
