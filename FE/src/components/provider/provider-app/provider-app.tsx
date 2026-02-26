import { responseError } from "@/lib/utils/response";
import {
  storage,
  useSocket,
  type BucketDataType,
  type ListDataType,
} from "@/lib/utils/storage";
import { set } from "date-fns";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { StateBucketApp } from "./state/bucket";
import { StatePathFileApp } from "./state/path";

export default function ProviderApp({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedFiles, setSelectedFiles] = useState<ListDataType[]>([]);

  const useBucket = StateBucketApp();

  const usePathFile = StatePathFileApp();
  const [page, setPage] = useState<number>(1);
  const [loadPercentage, setLoadPercentage] = useState<number | null>(null);

  const [folderId, setFolderId] = useState<number | undefined>(undefined);
  const [folderLevel, setFolderLevel] = useState<number | undefined>(undefined);

  const { socketId, on, off, emit } = useSocket();
  console.log({ socketId });

  useEffect(() => {
    // Listen ke notification:reminder
    on("loading", (data: { percentage: number }) => {
      console.log("loading diterima:", data);
      // setNotification(data);
      setLoadPercentage(data.percentage);
      if (data.percentage === 100) {
        setLoadPercentage(null);
      }
    });
    return () => {
      console.log("Cleaning up notification listener for userId:");
      off(`loading`);
      setLoadPercentage(null);
    };
  }, []);

  if (useBucket.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading files...</p>
        </div>
      </div>
    );
  }

  const Context = {
    useBucket: {
      ...useBucket,
      selectedBucket: useBucket.selectedBucket!,
    },
    usePathFile,
    usePagination: {
      page,
      setPage,
    },
    useFolder: {
      folderId,
      setFolderId,
      folderLevel,
      setFolderLevel,
    },
    useLoad: {
      loadPercentage,
    },
    selectedFiles,
    setSelectedFiles,
  };
  return (
    <ProviderAppContext.Provider value={Context}>
      {children}
    </ProviderAppContext.Provider>
  );
}

export const useAppProvider = () => {
  const context = React.useContext(ProviderAppContext);
  if (!context) {
    throw new Error("useAppProvider must be used within a ProviderApp");
  }
  return context;
};

const ProviderAppContext = React.createContext<null | ProviderAppType>(null);

type ProviderAppType = {
  useBucket: {
    bucketList: BucketDataType[];
    setBucketList: React.Dispatch<React.SetStateAction<BucketDataType[]>>;
    fetchListBucket: () => Promise<any>;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    selectedBucket: string;
    setSelectedBucket: React.Dispatch<React.SetStateAction<string | null>>;
  };
  useLoad: {
    loadPercentage: number | null;
  };
  usePathFile: {
    listPath: {
      name: string;
      id: number;
      level: number;
    }[];
    setListPath: React.Dispatch<
      React.SetStateAction<
        {
          name: string;
          id: number;
          level: number;
        }[]
      >
    >;
    currentPath: {
      name: string;
      id: number;
      level: number;
    } | null;
  };
  useFolder: {
    folderId: number | undefined;
    setFolderId: React.Dispatch<React.SetStateAction<number | undefined>>;
    folderLevel: number | undefined;
    setFolderLevel: React.Dispatch<React.SetStateAction<number | undefined>>;
  };
  usePagination: {
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
  };
  selectedFiles: ListDataType[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<ListDataType[]>>;
};
