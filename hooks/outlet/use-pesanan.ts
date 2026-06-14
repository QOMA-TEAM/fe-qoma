import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pesananService } from "@/services/outlet/pesanan-service";
import { toast } from "sonner";

export const PESANAN_QUERY_KEY = ["outletPesananList"];
export const PESANAN_DETAIL_QUERY_KEY = (id: string) => ["outletPesananDetail", id];

export function usePesananList(params?: { status?: string; search?: string; page?: number }) {
  return useQuery({
    queryKey: [...PESANAN_QUERY_KEY, params],
    queryFn: () => pesananService.getList(params),
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
    mutationFn: (id: string) => pesananService.konfirmasi(id),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.setQueryData(PESANAN_DETAIL_QUERY_KEY(data.data.id), data);
      queryClient.invalidateQueries({ queryKey: PESANAN_QUERY_KEY });
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
      queryClient.setQueryData(PESANAN_DETAIL_QUERY_KEY(data.data.id), data);
      queryClient.invalidateQueries({ queryKey: PESANAN_QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal memproses pembayaran");
    },
  });
}

export function useTambahItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, items }: { id: string; items: Array<{ menu_id: string; qty: number }>; menuNama?: string; menuHarga?: number }) =>
      pesananService.tambahItem(id, items),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: PESANAN_DETAIL_QUERY_KEY(variables.id) });
      const previousPesanan = queryClient.getQueryData<any>(PESANAN_DETAIL_QUERY_KEY(variables.id));
      
      if (previousPesanan?.data && variables.menuNama && variables.menuHarga) {
        const newPesanan = { ...previousPesanan, data: { ...previousPesanan.data, items: [...(previousPesanan.data.items || [])] } };
        const fakeItem = {
          id: `temp-${Date.now()}`,
          menu_id: variables.items[0].menu_id,
          nama: variables.menuNama,
          qty: 1,
          harga: variables.menuHarga,
          subtotal: variables.menuHarga,
          addons: []
        };
        newPesanan.data.items.push(fakeItem);
        newPesanan.data.total_harga += variables.menuHarga;
        queryClient.setQueryData(PESANAN_DETAIL_QUERY_KEY(variables.id), newPesanan);
      }
      return { previousPesanan };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(PESANAN_DETAIL_QUERY_KEY(data.data.id), data);
    },
    onError: (error: any, variables, context) => {
      if (context?.previousPesanan) {
        queryClient.setQueryData(PESANAN_DETAIL_QUERY_KEY(variables.id), context.previousPesanan);
      }
      toast.error(error.response?.data?.message || "Gagal menambahkan item pesanan");
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: PESANAN_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PESANAN_DETAIL_QUERY_KEY(variables.id) });
    },
  });
}

export function useUpdateQtyItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, detailId, qty, currentQty, harga }: { id: string; detailId: string; qty: number; currentQty?: number; harga?: number }) =>
      pesananService.updateQty(id, detailId, qty),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: PESANAN_DETAIL_QUERY_KEY(variables.id) });
      const previousPesanan = queryClient.getQueryData<any>(PESANAN_DETAIL_QUERY_KEY(variables.id));
      
      if (previousPesanan?.data && variables.currentQty !== undefined && variables.harga !== undefined) {
        const diffQty = variables.qty - variables.currentQty;
        const diffPrice = diffQty * variables.harga;

        const newPesanan = { ...previousPesanan, data: { ...previousPesanan.data, items: [...(previousPesanan.data.items || [])] } };
        const itemIndex = newPesanan.data.items.findIndex((i: any) => i.id === variables.detailId);
        
        if (itemIndex > -1) {
          newPesanan.data.items[itemIndex] = {
            ...newPesanan.data.items[itemIndex],
            qty: variables.qty,
            subtotal: variables.qty * variables.harga
          };
          newPesanan.data.total_harga += diffPrice;
          queryClient.setQueryData(PESANAN_DETAIL_QUERY_KEY(variables.id), newPesanan);
        }
      }
      return { previousPesanan };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(PESANAN_DETAIL_QUERY_KEY(data.data.id), data);
    },
    onError: (error: any, variables, context) => {
      if (context?.previousPesanan) {
        queryClient.setQueryData(PESANAN_DETAIL_QUERY_KEY(variables.id), context.previousPesanan);
      }
      toast.error(error.response?.data?.message || "Gagal mengubah jumlah pesanan");
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: PESANAN_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PESANAN_DETAIL_QUERY_KEY(variables.id) });
    },
  });
}

export function useHapusItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, detailId }: { id: string; detailId: string }) =>
      pesananService.hapusItem(id, detailId),
    onSuccess: (data) => {
      // 1. Injeksi data baru langsung ke cache (Seketika UI berubah)
      queryClient.setQueryData(PESANAN_DETAIL_QUERY_KEY(data.data.id), data);
      
      // 2. Invalidate List pesanan di background
      queryClient.invalidateQueries({ queryKey: PESANAN_QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal menghapus item pesanan");
    },
  });
}

export function useCancelPesanan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => pesananService.cancel(id),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.setQueryData(PESANAN_DETAIL_QUERY_KEY(data.data.id), data);
      queryClient.invalidateQueries({ queryKey: PESANAN_QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal membatalkan pesanan");
    },
  });
}
