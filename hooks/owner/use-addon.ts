import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { addonService, AddonPayload } from "@/services/owner/addon"

export function useAddons(page = 1, perPage = 10) {
  return useQuery({
    queryKey: ["owner-addons", page, perPage],
    queryFn: () => addonService.getAddons(page, perPage),
  })
}

export function useCreateAddon() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (payload: AddonPayload) => addonService.createAddon(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-addons"] })
    },
  })
}

export function useUpdateAddon() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AddonPayload }) => 
      addonService.updateAddon(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-addons"] })
    },
  })
}

export function useDeleteAddon() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => addonService.deleteAddon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-addons"] })
    },
  })
}
