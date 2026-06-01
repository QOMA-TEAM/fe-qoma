import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { menuService } from "@/services/owner/menu"

export const useMenu = (
  page: number = 1,
  search: string = "",
  kategori_id: string = "",
  is_active: string = ""
) => {
  return useQuery({
    queryKey: ["menu", page, search, kategori_id, is_active],
    queryFn: () => menuService.getMenu(page, search, kategori_id, is_active),
  })
}

export const useAddMenu = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: FormData) => menuService.addMenu(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu"] })
    },
  })
}

export const useUpdateMenu = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => menuService.updateMenu(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu"] })
    },
  })
}

export const useDeleteMenu = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => menuService.deleteMenu(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu"] })
    },
  })
}
