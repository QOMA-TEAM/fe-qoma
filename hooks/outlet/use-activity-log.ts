import { useQuery } from "@tanstack/react-query";
import { activityLogOutletService } from "@/services/outlet/activity-log";

export const useActivityLogList = (
  page: number,
  search?: string,
  aktivitas?: string,
  dari?: string,
  sampai?: string,
  perPage: number = 15
) => {
  return useQuery({
    queryKey: ["outlet-activity-logs", page, search, aktivitas, dari, sampai, perPage],
    queryFn: () => activityLogOutletService.getLogs(page, search, aktivitas, dari, sampai, perPage),
  });
};
