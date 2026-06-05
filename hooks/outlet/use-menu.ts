import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { menuOutletService } from "@/services/outlet/menu-outlet-service";
import { toast } from "sonner";

export const MENU_OUTLET_QUERY_KEY = "menu-outlet-list";

export function useOutletMenu(page: number = 1, search: string = "", kategoriId: string = "") {
  return useQuery({
    queryKey: [MENU_OUTLET_QUERY_KEY, page, search, kategoriId],
    queryFn: () => menuOutletService.getList(page, search, kategoriId),
    placeholderData: (previousData) => previousData,
  });
}

export function useUpdateAvailabilityMenu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ menuId, isAvailable }: { menuId: string; isAvailable: boolean }) =>
      menuOutletService.updateAvailability(menuId, isAvailable),
    onSuccess: (data) => {
      toast.success(data.message || "Ketersediaan menu berhasil diupdate");
      queryClient.invalidateQueries({ queryKey: [MENU_OUTLET_QUERY_KEY] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal mengubah ketersediaan menu");
    },
  });
}

export function useAjukanPerubahanHarga() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ menuId, hargaBaru, alasan }: { menuId: string; hargaBaru: number; alasan: string }) =>
      menuOutletService.ajukanPerubahanHarga(menuId, hargaBaru, alasan),
    onSuccess: (data) => {
      toast.success(data.message || "Pengajuan harga berhasil dikirim");
      queryClient.invalidateQueries({ queryKey: [MENU_OUTLET_QUERY_KEY] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal mengajukan perubahan harga");
    },
  });
}
