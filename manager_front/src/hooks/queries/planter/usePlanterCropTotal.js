import { useQuery } from "@tanstack/react-query";

import { getDashboardCropTotalAPI } from "@apis/planterAPIs";
import { PlanterCropTotalKey } from "@src/utils/query-keys/PlanterQueryKeys";

export default function usePlanterCropTotal({ queryType, successFn, errorFn }) {
  return useQuery([PlanterCropTotalKey, queryType], () => getDashboardCropTotalAPI(queryType), {
    staleTime: 10 * (60 * 1000), // 10 mins
    cacheTime: 15 * (60 * 1000), // 15 mins
    retry: 0,
    enabled: true,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    refetchInterval: false,
    onSuccess: (data) => successFn(data),
    onError: (error) => errorFn(error),
  });
}
