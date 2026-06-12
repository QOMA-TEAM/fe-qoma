import { useQuery } from "@tanstack/react-query";
import { menuOutletService } from "@/services/outlet/menu-outlet-service";

export const OUTLET_MENU_QUERY_KEY = ["outletMenuList"];

export function useOutletMenuList() {
  return useQuery({
    queryKey: OUTLET_MENU_QUERY_KEY,
    queryFn: () => menuOutletService.getList(),
  });
}
