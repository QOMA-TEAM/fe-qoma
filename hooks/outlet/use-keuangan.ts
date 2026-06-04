import { useQuery } from "@tanstack/react-query"
import { outletKeuanganService } from "@/services/outlet/keuangan"

export const useOutletKeuangan = (range: string = "7days") => {
  return useQuery({
    queryKey: ["outlet-keuangan", range],
    queryFn: () => outletKeuanganService.get(range),
  })
}
