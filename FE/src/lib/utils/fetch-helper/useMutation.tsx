import { useState } from 'react';
import { mutateGeneral } from './fetch-helper';

// export type UseMutationDataType<Data, ErrorData = any> = Omit<
//   FetchReturnType,
//   'data' | 'error'
// > & {
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

export function useMutation<Data = any, ErrorData = any>(
  url: string,
  type: 'post' | 'put' | 'delete',
  more?: MoreProps<Data, ErrorData>,
): FetchReturnType<Data, ErrorData> {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorType<ErrorData> | null>(null);
  const [success, setSuccess] = useState<SuccessType<Data> | null>(null);

  const mutate = async (optional?: { payload?: any; params?: object }) => {
    const res = await mutateGeneral(url, {
      ...more,
      payload: {
        ...more?.payload,
        ...optional?.payload,
      },
      params: {
        ...more?.params,
        ...optional?.params,
      },
      type,
      setLoading: setIsLoading,
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

  return {
    mutate,
    isLoading,
    success,
    error,
  };
}

type MoreProps<Data = any, ErrorData = any> = {
  params?: object;
  payload?: any;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
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
  onSuccess?: ({
    message,
    status,
    data,
  }: {
    message: string;
    status: number;
    data?: Data;
  }) => any;
  onError?: ({
    status,
    message,
    error,
  }: {
    status: number;
    message: string;
    error: ErrorData;
  }) => any;
};

type ErrorType<Data = any> = {
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
  mutate: MutateType<Data>;
  isLoading: boolean;
  error: ErrorType<ErrorData> | null;
  success: SuccessType<Data> | null;
};

type MutateType<Data = any> = (optional?: {
  payload?: any;
  params?: object;
}) => Promise<
  | {
      message: string;
      status: number;
      data?: Data;
      page?: number;
      total_pages?: number;
    }
  | undefined
>;
