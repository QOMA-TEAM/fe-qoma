import { useQuery } from "@tanstack/react-query"
import { keuanganService } from "@/services/owner/keuangan"

export const useKeuanganSummary = (range: string = "7days", outletId?: string) => {
  return useQuery({
    queryKey: ["keuangan-summary", range, outletId],
    queryFn: () => keuanganService.getSummary(range, outletId),
  })
}

export const useKeuanganList = (
  page: number = 1,
  range: string = "7days",
  tipe: string = "semua",
  outletId?: string,
  per_page: number = 10
) => {
  return useQuery({
    queryKey: ["keuangan-list", page, range, tipe, outletId, per_page],
    queryFn: () => keuanganService.getList(page, range, tipe, outletId, per_page),
  })
}
