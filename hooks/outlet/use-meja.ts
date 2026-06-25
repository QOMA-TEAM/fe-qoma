import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mejaService } from "@/services/outlet/meja-service";
import { toast } from "sonner";

export const MEJA_QUERY_KEY = "meja-list";

export function useMejaList(page: number = 1, search: string = "") {
  return useQuery({
    queryKey: [MEJA_QUERY_KEY, page, search],
    queryFn: () => mejaService.getList(page, search),
    placeholderData: (previousData) => previousData,
  });
}

export function useCreateMeja() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (nomorMeja: string) => mejaService.create(nomorMeja),
    onSuccess: (data) => {
      toast.success(data.message || "Meja berhasil ditambahkan");
      queryClient.invalidateQueries({ queryKey: [MEJA_QUERY_KEY] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal menambahkan meja");
    },
  });
}

export function useUpdateMeja() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, nomorMeja, status }: { id: string; nomorMeja?: string; status?: string }) =>
      mejaService.update(id, nomorMeja, status),
    onSuccess: (data) => {
      toast.success(data.message || "Meja berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: [MEJA_QUERY_KEY] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal memperbarui meja");
    },
  });
}

export function useDeleteMeja() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => mejaService.delete(id),
    onSuccess: (data) => {
      toast.success(data.message || "Meja berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: [MEJA_QUERY_KEY] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal menghapus meja");
    },
  });
}
