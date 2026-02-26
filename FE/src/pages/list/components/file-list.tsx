import { storage, type ListDataType } from "@/lib/utils/storage";
import {
  FileIcon,
  FolderIcon,
  DownloadIcon,
  TrashIcon,
  ChevronRightIcon,
  EyeIcon,
  Loader2,
  Image,
  Video,
  FileText,
} from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useRef, useState, type SetStateAction } from "react";
import { set } from "date-fns";
import { useAppProvider } from "@/components/provider/provider-app/provider-app";
import { formatDate } from "@/lib/utils/date";
import { formatFileSize } from "@/lib/utils/file";
import { useDebouncedCallback } from "use-debounce";

interface FileListProps {
  files: ListDataType[];
  folders: { name: string; id: number; level: number }[];
  onDelete: (
    filePath: string,
    currentPath: { name: string; id: number; level: number } | null
  ) => Promise<any>;
  isLoading?: boolean;
  getFiles: () => void;
  isViewMore: boolean;
  setIsViewMore: React.Dispatch<React.SetStateAction<boolean>>;
  totalData: number;
  isPaginationLoading: boolean;
  setIsPaginationLoading: React.Dispatch<React.SetStateAction<boolean>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  take: number;
  folderId: number | undefined;
  folderLevel: number | undefined;
  setFolderId: React.Dispatch<React.SetStateAction<number | undefined>>;
  setFolderLevel: React.Dispatch<React.SetStateAction<number | undefined>>;
}

export const FileList = ({
  files,
  folders,
  onDelete,
  isLoading,
  getFiles,
  isViewMore,
  totalData,
  isPaginationLoading,
  page,
  setPage,
  totalPages,
  setIsViewMore,
  setIsPaginationLoading,
  take,
  folderId,
  folderLevel,
  setFolderId,
  setFolderLevel,
}: FileListProps) => {
  const {
    usePathFile: { listPath, setListPath, currentPath },
    useBucket: { selectedBucket },
    selectedFiles,
    setSelectedFiles,
  } = useAppProvider();

  const [isLoadingDownload, setIsLoadingDownload] = useState<string | null>(
    null
  );

  const toggleFileSelection = (file: ListDataType) => {
    setSelectedFiles((prev) =>
      prev.some((item) => item.id === file.id)
        ? prev.filter((item) => item.id !== file.id)
        : [...prev, file]
    );
  };

  const toggleAllFileSelection = () => {
    if (selectedFiles.length === files.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(files);
    }
  };

  const onDownload = async (file: ListDataType) => {
    if (file.path) {
      setIsLoadingDownload(file.path);
      await storage.from(selectedBucket).download(file.path);
      setIsLoadingDownload(null);
    }
  };

  console.log({ selectedFiles });

  // const [take, setTake] = useState<number>(10);
  // const [page, setPage] = useState<number>(1);
  // const [isPaginationLoading, setIsPaginationLoading] = useState(true);
  // const [isViewMore, setIsViewMore] = useState(false);

  // const [totalData, setTotalData] = useState<number>(1);
  // const [totalPages, setTotalPages] = useState<number>(1);

  const isAllLoaded = files.length >= totalData;

  const containerRef = useRef<HTMLDivElement>(null);

  const handleChangePage = useDebouncedCallback((scrollPercentage: number) => {
    console.log("Jalan...");
    if (
      scrollPercentage >= 95 &&
      !isLoading &&
      // currentPage === page &&
      page < totalPages &&
      totalData > take &&
      files.length >= take &&
      isViewMore
    ) {
      console.log("Masuk...");
      // console.log({ currentPage, page });
      setIsPaginationLoading(true);
      setPage((prev) => prev + 1);
    }
  }, 1000);

  useEffect(() => {
    const timer = setTimeout(() => {
      const container = containerRef.current;
      if (!container) return;

      const handleScroll = () => {
        const { scrollHeight, scrollTop, clientHeight } = container;
        const scrollPercentage =
          ((scrollTop + clientHeight) / scrollHeight) * 100;

        console.log({ scrollPercentage });

        handleChangePage(scrollPercentage);
      };

      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }, 100);

    return () => clearTimeout(timer);
  }, [isPaginationLoading, isViewMore, files, totalData, page, totalPages]);

  console.log({ totalData });

  return (
    <div className="space-y-4">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-1 text-sm mb-6 pb-4 border-b border-blue-100">
        <Button
          variant={currentPath?.name === "" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setPage(1);
            setFolderId(undefined);
            setFolderLevel(undefined);
            // getFiles(undefined, undefined, 1);
            // setCurrentPath(null);
            setListPath([]);
            setIsViewMore(false);
          }}
          className="h-9 bg-blue-600 hover:bg-blue-700 text-white hover:text-white border-0 font-medium transition-colors"
        >
          Root
        </Button>
        {listPath.map((folder, index) => (
          <span
            key={index}
            className="flex items-center gap-1 hover:underline cursor-pointer"
            onClick={() => {
              setListPath((prev) =>
                prev.filter((_, pIndex) => pIndex <= index)
              );
              setFolderId(folder.id);
              setFolderLevel(folder.level);
              setPage(1);
              setIsViewMore(false);
              // getFiles(folder.id, folder.level, 1);
              //   setCurrentPath(folder);
            }}
          >
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            <span className="font-medium text-gray-700">{folder.name}</span>
          </span>
        ))}
      </div>

      {selectedFiles.length > 0 && (
        <div className="">{selectedFiles.length} file selected</div>
      )}

      {/* Folders and Files Table */}
      <div className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-4 py-2 flex items-center sticky top-0 text-sm font-medium text-gray-700">
          <Checkbox
            checked={selectedFiles.length === files.length}
            className="mr-3"
            onCheckedChange={() => toggleAllFileSelection()}
          />
          <div className="mr-2">No</div>
          <div className="flex-1 flex items-center min-w-0">
            <span>Name</span>
          </div>
          <div className="w-48 text-right pr-4">Last Modified</div>
          <div className="w-28 text-right">Size</div>
        </div>

        {isLoading && (
          <div className="min-h-[200px] flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading files...</p>
            </div>
          </div>
        )}

        <div
          className="divide-y max-h-[550px] overflow-y-auto"
          ref={containerRef}
        >
          {!isLoading && (
            <>
              {/* Folders */}
              {folders.map((folder) => (
                <div
                  key={folder.name}
                  className="px-4 py-2 flex items-center hover:bg-gray-50 transition-colors cursor-pointer group"
                  onClick={() => {
                    //   setCurrentPath(folder);
                    setListPath((prev) => [...prev, folder]);
                    // getFiles(folder.id, folder.level, 1);
                    setFolderId(folder.id);
                    setFolderLevel(folder.level);
                    setPage(1);
                    setIsViewMore(false);
                  }}
                >
                  {/* <Checkbox checked={false} className="mr-3" disabled /> */}
                  <div className="flex-1 flex items-center min-w-0">
                    <FolderIcon className="w-5 h-5 text-yellow-500" />
                    <div className="ml-3 min-w-0 flex-1">
                      <p className="text-sm text-gray-900 font-medium">
                        {folder.name}
                      </p>
                    </div>
                  </div>

                  <div className="w-48 text-right pr-4 text-sm text-gray-500">
                    —
                  </div>

                  <div className="w-28 text-right text-sm text-gray-500">—</div>
                </div>
              ))}

              {/* Files */}
              {files.map((file, index) => (
                <div
                  key={file.id}
                  className="px-4 py-2 flex items-center hover:bg-gray-50 transition-colors group"
                >
                  <Checkbox
                    checked={selectedFiles.some((item) => item.id === file.id)}
                    onCheckedChange={() => toggleFileSelection(file)}
                    className="mr-3"
                  />
                  <div className="mr-5">{index + 1}</div>
                  <div className="flex-1 flex items-center min-w-0 cursor-pointer">
                    {getFileIcon(file.mimeType, false)}
                    <div className="ml-3 min-w-0 flex-1">
                      <p
                        className="text-sm text-gray-900 truncate"
                        title={file.filename}
                      >
                        {file.filename}
                      </p>
                    </div>
                  </div>

                  <div className="w-48 text-right pr-4 text-sm text-gray-600">
                    {formatDate(file.createdAt)}
                  </div>

                  <div className="w-28 text-right text-sm text-gray-600">
                    {formatFileSize(file.size)}
                  </div>

                  <div className="ml-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(file.publicUrl, "_blank")}
                      className="h-8 w-8 p-0"
                      title="View"
                    >
                      <EyeIcon className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDownload(file)}
                      className="h-8 w-8 p-0"
                      title="Download"
                      disabled={isLoadingDownload === file.path}
                    >
                      {isLoadingDownload === file.path ? (
                        <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                      ) : (
                        <DownloadIcon className="w-4 h-4 text-blue-600" />
                      )}
                    </Button>
                    <ConfirmDialog
                      onConfirm={async () => {
                        await onDelete(file.path, currentPath);
                        return true;
                      }}
                      variant="delete"
                    >
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4 text-red-600" />
                      </Button>
                    </ConfirmDialog>
                  </div>
                </div>
              ))}
            </>
          )}
          {!isViewMore && totalData > 20 && (
            <div className="px-4 py-3 flex justify-center border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                className="text-xs text-blue-600 hover:bg-blue-50 rounded-lg"
                onClick={() => {
                  setIsViewMore(true);
                }}
              >
                Lihat Lainnya
              </Button>
            </div>
          )}
          {!isAllLoaded && isViewMore && (
            <div className="px-4 py-3 flex justify-center border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                className="text-xs text-main hover:bg-transparent rounded-lg gap-2 cursor-default"
                onClick={() => setIsViewMore(true)}
              >
                <Loader2 className="animate-spin w-4 h-4" /> Memuat...
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const getFileIcon = (mimeType: string, isFolder: boolean = false) => {
  if (isFolder) {
    return <FolderIcon className="w-5 h-5 text-yellow-500" />;
  }

  if (mimeType.startsWith("image/")) {
    return <Image className="w-5 h-5 text-blue-500" />;
  } else if (mimeType.startsWith("video/")) {
    return <Video className="w-5 h-5 text-red-500" />;
  } else if (mimeType.startsWith("audio/")) {
    return <FileIcon className="w-5 h-5 text-purple-500" />;
  } else if (mimeType === "application/pdf") {
    return <FileText className="w-5 h-5 text-orange-500" />;
  } else {
    return <FileIcon className="w-5 h-5 text-gray-500" />;
  }
};
