import { useQuery } from "@tanstack/react-query";

import { getWorkingWorkListListAPI } from "@apis/planterAPIs";

import { workingWorkListKey } from "@utils/query-keys/PlanterQueryKeys";

export default function useWorkingWorkList({ serialNumber, errorFn, successFn }) {
  return useQuery([workingWorkListKey], () => getWorkingWorkListListAPI(serialNumber), {
    staleTime: 10 * (60 * 1000), // 10 mins
    cacheTime: 15 * (60 * 1000), // 15 mins
    retry: 0,
    enabled: !!serialNumber ? true : false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    onError: (error) => errorFn(error),
    onSuccess: (data) => successFn(data),
  });
}
