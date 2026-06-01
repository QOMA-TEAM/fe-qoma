import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { outletService } from "@/services/owner/outlet"

export const useOutlets = (page: number = 1, search: string = "") => {
  return useQuery({
    queryKey: ["outlets", page, search],
    queryFn: () => outletService.getOutlets(page, search)
  })
}

export const useAddOutlet = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ usahaId, data }: { usahaId: string; data: any }) => 
      outletService.addOutlet(usahaId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outlets"] })
    },
  })
}
