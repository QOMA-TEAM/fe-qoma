import { useQuery } from "@tanstack/react-query";
import { activityLogOwnerService } from "@/services/owner/activity-log-service";

export const useOwnerActivityLogList = (
  page: number,
  search?: string,
  aktivitas?: string,
  dari?: string,
  sampai?: string,
  outletId?: string,
  perPage: number = 15
) => {
  return useQuery({
    queryKey: ["owner-activity-logs", page, search, aktivitas, dari, sampai, outletId, perPage],
    queryFn: () => activityLogOwnerService.getLogs(page, search, aktivitas, dari, sampai, outletId, perPage),
    placeholderData: (previousData) => previousData,
  });
};
