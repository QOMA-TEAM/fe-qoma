import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { kategoriService } from "@/services/owner/kategori"

export const useKategori = (page: number = 1, search: string = "", per_page: number = 10) => {
  return useQuery({
    queryKey: ["kategori", page, search, per_page],
    queryFn: () => kategoriService.getKategori(page, search, per_page),
  })
}

export const useAddKategori = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (nama: string) => kategoriService.addKategori(nama),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kategori"] })
    },
  })
}

export const useUpdateKategori = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, nama }: { id: string; nama: string }) => kategoriService.updateKategori(id, nama),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kategori"] })
    },
  })
}

export const useDeleteKategori = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => kategoriService.deleteKategori(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kategori"] })
    },
  })
}
