import { useMutation } from "@tanstack/react-query";

import { registerPlanter } from "@src/apis/planterAPIs";

export default function useRegisterPlanter(successFn, errorFn) {
  return useMutation(
    ({ data }) => {
      return registerPlanter(data);
    },
    {
      onSuccess: (data) => successFn(data),
      onError: (error) => {
        errorFn(error);
      },
    },
  );
}
