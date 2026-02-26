import { storage, useSocket, type ListDataType } from "@/lib/utils/storage";
import { useEffect, useState } from "react";
import { UploadDialog } from "./components/upload";
import { DeleteDialog } from "./components/delete";
import { FileList } from "./components/file-list";
import { response, responseError } from "@/lib/utils/response";
import { useAppProvider } from "@/components/provider/provider-app/provider-app";
import { Button } from "@/components/ui/button";
import LoadingPageWithText from "@/components/loading/loading-page";

export default function ListPage() {
  const {
    useBucket: { selectedBucket },
    usePagination: { page, setPage },
    selectedFiles,
    setSelectedFiles,
    useFolder: { folderId, folderLevel, setFolderId, setFolderLevel },
  } = useAppProvider();
  const [folders, setFolders] = useState<
    { name: string; id: number; level: number }[]
  >([]);
  const [files, setFiles] = useState<ListDataType[]>([]);
  const [loading, setLoading] = useState(true);

  const [take, setTake] = useState<number>(20);
  const [isPaginationLoading, setIsPaginationLoading] = useState(true);
  const [isViewMore, setIsViewMore] = useState(false);

  const [totalData, setTotalData] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // const [folderId, setFolderId] = useState<number | undefined>(undefined);
  // const [folderLevel, setFolderLevel] = useState<number | undefined>(undefined);

  const getFiles = () => {
    storage
      .from(selectedBucket)
      .listFiles({ page, take }, folderId, folderLevel)
      .then((res) => {
        if (res.data) {
          const newFiles = res.data.files;
          setFolders(res.data.folders);

          if (page === 1) {
            setFiles(newFiles);
            setIsPaginationLoading(false);
          } else if (page > 1 && page <= totalPages && isViewMore) {
            setFiles((prev) => [...prev, ...newFiles]);
            setIsPaginationLoading(false);
          }

          // setPage(res.data.page);
          setTotalPages(res.data.totalPages);
          setTotalData(res.data.totalData);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getFiles();
  }, [selectedBucket, page, take, folderId, folderLevel]);

  const handleDeleteFile = async (
    filePath: string,
    currentPath: { name: string; id: number; level: number } | null,
  ) => {
    try {
      const result = await storage.from(selectedBucket).remove([filePath]);
      // getFiles(currentPath?.id, currentPath?.level);
      if (page === 1) {
        getFiles();
      } else {
        setPage(1);
        setFolderId(currentPath?.id);
        setFolderLevel(currentPath?.level);
      }
      return response(result, true);
    } catch (error) {
      return responseError(error, true);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
      <div className="max-w-full mx-auto h-[90%]">
        <div className="mb-6 flex items-start justify-between">
          <div className="">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              Bucket : {selectedBucket}
            </h1>
            <p className="text-blue-600/70 mt-2 font-medium">
              Total: {totalData} files
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DeleteDialog
              onDeleteSuccess={() => {
                if (page === 1) {
                  getFiles();
                } else {
                  setPage(1);
                }
                setSelectedFiles([]);
              }}
              selectedFiles={selectedFiles}
            />
            <UploadDialog onUploadSuccess={getFiles} />
          </div>
        </div>

        {files.length === 0 && folders.length === 0 && !loading ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-blue-100">
            <p className="text-blue-600/60 text-lg font-medium">
              📁 Tidak ada file
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
            <FileList
              files={files}
              folders={folders}
              onDelete={handleDeleteFile}
              isLoading={loading}
              getFiles={getFiles}
              isPaginationLoading={isPaginationLoading}
              isViewMore={isViewMore}
              totalData={totalData}
              page={page}
              setPage={setPage}
              setIsPaginationLoading={setIsPaginationLoading}
              totalPages={totalPages}
              setIsViewMore={setIsViewMore}
              take={take}
              folderId={folderId}
              folderLevel={folderLevel}
              setFolderId={setFolderId}
              setFolderLevel={setFolderLevel}
            />
          </div>
        )}
      </div>
    </div>
  );
}
