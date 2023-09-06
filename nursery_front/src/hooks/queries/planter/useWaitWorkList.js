import { useQuery } from "@tanstack/react-query";

import { getWaitWorkListListAPI } from "@apis/planterAPIs";

import { waitWorkListKey } from "@utils/query-keys/PlanterQueryKeys";

export default function useWaitWorkList({ serialNumber, page, errorFn, successFn }) {
  return useQuery([waitWorkListKey, page], () => getWaitWorkListListAPI(serialNumber, page), {
    staleTime: 10 * (60 * 1000), // 10 mins
    cacheTime: 15 * (60 * 1000), // 15 mins
    retry: 0,
    enabled: !!serialNumber ? true : false,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    refetchInterval: false,
    onError: (error) => errorFn(error),
    onSuccess: (data) => successFn(data),
  });
}
