import { useQuery } from "@tanstack/react-query";

import { getAdminListAPI } from "@apis/authAPIs";
import { useManagerListKey } from "@src/utils/query-keys/AuthQueryKeys";

export default function useManagerList({ page, size, successFn, errorFn }) {
  return useQuery(
    [useManagerListKey, page, size],
    () => getAdminListAPI(page, size),
    {
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
    },
  );
}
