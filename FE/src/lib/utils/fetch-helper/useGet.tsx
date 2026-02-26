import { useEffect, useState } from "react";
import { getGeneral } from "./fetch-helper";

// export type UseGetDataType<Data, ErrorData = any> = Omit<
//   FetchReturnType<any>,
//   'data' | 'error'
// > & {
//   data: Data | null;
//   success:
//     | (Omit<SuccessType, 'data'> & {
//         data?: Data | null;
//       })
//     | null;
//   error:
//     | (Omit<ErrorType, 'data'> & {
//         data: ErrorData | null;
//       })
//     | null;
// };

export function useGet<Data = any, ErrorData = any>(
  url: string,
  more?: MoreProps<Data, ErrorData>
): FetchReturnType<Data, ErrorData> {
  const [data, setData] = useState<Data | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ErrorType<ErrorData> | null>(null);
  const [success, setSuccess] = useState<SuccessType<Data> | null>(null);

  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalData, setTotalData] = useState<number>(0);

  const refetch = async () => {
    const res = await getGeneral(url, {
      ...more,
      setLoading: setIsLoading,
      setData: setData,
      setPage: setPage,
      setTotalPages: setTotalPages,
      setTotalData: setTotalData,
      onLoading() {
        if (more?.onLoading) more.onLoading();
      },
      onSuccess(successData) {
        if (more?.onSuccess) more.onSuccess(successData);
        setSuccess(successData);
      },
      onError(errorData) {
        if (more?.onError) more.onError(errorData);
        setError(errorData);
      },
    });
    return res;
  };

  // const initialFetch = useDebouncedCallback(refetch);

  const Dependencies = more?.useEffectDependencies || [];
  const Enabled = more?.enabled !== undefined ? more.enabled : true;

  useEffect(() => {
    if (Enabled) {
      // initialFetch();
      refetch();
    }
  }, [...Dependencies, Enabled]);

  return {
    data: data,
    isLoading,
    success,
    error,
    refetch,
    page,
    totalPages,
    totalData,
  };
}

type MoreProps<Data = any, ErrorData = any> = {
  enabled?: boolean;
  params?: object;
  firstLoad?: boolean;
  endLoad?: boolean;
  hideToast?: boolean;
  toast?: {
    hideSuccess?: boolean;
    hideError?: boolean;
    successTitle?: string;
    successMsg?: string;
    errorTitle?: string;
    errorMsg?: string;
  };
  onLoading?: () => any;
  onSuccess?: (params: { message: string; status: number; data?: Data }) => any;
  onError?: (params: {
    status: number;
    message: string;
    error: any;
    data: ErrorData;
  }) => any;
  useEffectDependencies?: any[];
};

export type ErrorType<Data = any> = {
  data: Data;
  error: any;
  message: string;
  status: number;
};
type SuccessType<Data = any> = {
  message: string;
  status: number;
  data?: Data;
};

type FetchReturnType<Data, ErrorData> = {
  data: Data | null;
  isLoading: boolean;
  error: ErrorType<ErrorData> | null;
  success: SuccessType<Data> | null;
  refetch: () => Promise<
    | {
        message: string;
        status: number;
        data?: any;
        page?: number;
        total_pages?: number;
      }
    | undefined
  >;
  page: number;
  totalPages: number;
  totalData: number;
};
