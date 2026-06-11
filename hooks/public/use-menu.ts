import { useQuery } from "@tanstack/react-query"
import { publicMenuService } from "@/services/public/menu"

export const useValidasiMeja = (outletId: string | null, mejaId: string | null) => {
  return useQuery({
    queryKey: ["validasi-meja", outletId, mejaId],
    queryFn: () => publicMenuService.validasiMeja(outletId!, mejaId!),
    enabled: !!outletId && !!mejaId,
    retry: false, // Don't retry if it fails (e.g., outlet closed or invalid table)
  })
}
