import { useQuery } from "@tanstack/react-query"
import { outletKeuanganService } from "@/services/outlet/keuangan"

export const useOutletKeuangan = (range: string = "7days", page: number = 1, tipe: string = "semua") => {
  return useQuery({
    queryKey: ["outlet-keuangan", range, page, tipe],
    queryFn: () => outletKeuanganService.get(range, page, tipe),
  })
}
