import axiosInstance from '../axios/axiosInstance';
import { response, responseError } from '../response';

export const getGeneral = async (
  url: string,
  more?: {
    setData?: React.Dispatch<React.SetStateAction<any>>;
    setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
    setPage?: React.Dispatch<React.SetStateAction<any>>;
    setTotalPages?: React.Dispatch<React.SetStateAction<any>>;
    setTotalData?: React.Dispatch<React.SetStateAction<any>>;
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
      data?: any;
    }) => any;
    onError?: ({
      status,
      message,
      error,
      data,
    }: {
      status: number;
      message: string;
      error: any;
      data: any;
    }) => any;
    params?: object;
  },
) => {
  if (
    more?.setLoading &&
    (more?.firstLoad == true || !more || more.firstLoad === undefined)
  ) {
    more.setLoading(true);
  }

  if (more?.onLoading) more.onLoading();

  let showToast = true;

  try {
    const res = await axiosInstance.get(url, {
      params: more?.params,
    });
    const resData = response(res);
    if (more?.onSuccess) {
      await more.onSuccess(resData);
    }
    if (more?.setData) more.setData(resData.data);
    if (resData.total_pages && resData.page) {
      if (more?.setPage) more.setPage(resData.page);
      if (more?.setTotalPages) more.setTotalPages(resData.total_pages);
      if (more?.setTotalData) more.setTotalData(resData.total_data);
    }
    return resData || null;
  } catch (error) {
    if (more?.toast?.hideError === true) showToast = false;
    else if (more?.hideToast === true) showToast = false;
    else showToast = true;
    const errData = responseError(
      error,
      showToast,
      more?.toast?.errorMsg,
      more?.toast?.errorTitle,
    );
    if (more?.onError) {
      await more.onError({
        status: errData.error?.response?.data?.status,
        message: errData.error?.response?.data?.message,
        data: errData.error?.response?.data?.data,
        error: errData.error,
      });
    }
  } finally {
    if (
      more?.setLoading &&
      (more?.endLoad == true || !more || more.endLoad === undefined)
    ) {
      more.setLoading(false);
    }
  }
};

export const deleteGeneral = async (
  url: string,
  more?: {
    setData?: React.Dispatch<React.SetStateAction<any>>;
    setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
    firstLoad?: boolean;
    endLoad?: boolean;
    toast?: {
      hide?: boolean;
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
      data?: any;
    }) => any;
    onError?: ({
      status,
      message,
      error,
    }: {
      status: number;
      message: string;
      error: any;
    }) => any;
    params?: object;
  },
) => {
  if (
    more?.setLoading &&
    (more?.firstLoad == true || !more || more.firstLoad === undefined)
  ) {
    more.setLoading(true);
  }

  if (more?.onLoading) more.onLoading();

  let showToast = true;
  if (more?.toast && more.toast.hide) showToast = false;
  try {
    const res = await axiosInstance.delete(url, {
      params: more?.params,
    });
    const resData = response(
      res,
      showToast,
      more?.toast?.successMsg,
      more?.toast?.successTitle,
    );
    if (more?.onSuccess) {
      await more.onSuccess(resData);
    }
    if (more?.setData) more.setData(resData.data);

    return resData || null;
  } catch (error) {
    const errData = responseError(
      error,
      showToast,
      more?.toast?.errorMsg,
      more?.toast?.errorTitle,
    );
    if (more?.onError) {
      await more.onError({
        status: errData.status,
        message: errData.message,
        error: errData.error,
      });
    }
  } finally {
    if (
      more?.setLoading &&
      (more?.endLoad == true || !more || more.endLoad === undefined)
    ) {
      more.setLoading(false);
    }
  }
};

export const mutateGeneral = async (
  url: string,
  more: {
    params?: object;
    payload?: any;
    type: 'post' | 'put' | 'delete';
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
      data?: any;
    }) => any;
    onError?: ({
      status,
      message,
      error,
      data,
    }: {
      status: number;
      message: string;
      error: any;
      data: any;
    }) => any;
  },
) => {
  const { payload, params, type, setLoading } = more;
  if (
    setLoading &&
    (more?.firstLoad == true || !more || more.firstLoad === undefined)
  ) {
    setLoading(true);
  }

  if (more.onLoading) more.onLoading();

  let showToast = true;
  // if (more.hideToast === true) showToast = false;

  try {
    if (more.toast?.hideSuccess === true) showToast = false;
    else if (more.hideToast === true) showToast = false;
    else showToast = true;
    let res;
    if (type === 'post' || type === 'put') {
      res = await axiosInstance[type](url, payload, { params });
    } else {
      res = await axiosInstance.delete(url, { params });
    }
    // const res = await axiosInstance[type](url, payload);
    const resData = response(
      res,
      showToast,
      more.toast?.successMsg,
      more.toast?.successTitle,
    );
    if (more?.onSuccess) {
      await more.onSuccess(resData);
    }
    return resData || null;
  } catch (error) {
    if (more.toast?.hideError === true) showToast = false;
    else if (more.hideToast === true) showToast = false;
    else showToast = true;
    const errData = responseError(
      error,
      showToast,
      more.toast?.errorMsg,
      more.toast?.errorTitle,
    );
    if (more?.onError) {
      await more.onError({
        status: errData.error?.response?.data?.status,
        message: errData.error?.response?.data?.message,
        data: errData.error?.response?.data?.data,
        error: errData.error,
      });
    }
    return;
  } finally {
    if (
      setLoading &&
      (more?.endLoad == true || !more || more.endLoad === undefined)
    ) {
      setLoading(false);
    }
  }
};

// Example

/*

  const {data:session} = useSession()

const [Data, setData] = useState<any>();
const [isLoading, setIsLoading] = useState<boolean>(true);

mutateGeneral("url", {
    payload: ,
    type: "",
    setLoading: ,
    onSuccess: refresh,
    onError({ message }) {
        setError(message);
    },
});

getGeneral("url", {
    setData: ,
    setLoading: ,
});

deleteGeneral("url", {
    setData: ,
    setLoading: ,
});

GRANT ALL ON SCHEMA public TO dev;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO dev;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO dev;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO dev;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO dev;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO dev;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO dev;

*/
