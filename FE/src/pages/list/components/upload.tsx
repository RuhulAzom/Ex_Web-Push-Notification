import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { storage } from "@/lib/utils/storage";
import { useState } from "react";
import { Upload } from "lucide-react";
import { response, responseError } from "@/lib/utils/response";
import { useAppProvider } from "@/components/provider/provider-app/provider-app";
import { toaster } from "@/components/ui/toaster";
import LoadingPageWithText from "@/components/loading/loading-page";

export function UploadDialog({
  onUploadSuccess,
}: {
  onUploadSuccess?: (folderId?: number, folderLevel?: number) => void;
}) {
  const {
    useBucket: { selectedBucket },
    usePathFile: { currentPath, listPath },
    useLoad: { loadPercentage },
  } = useAppProvider();
  const [file, setFile] = useState<File | null>(null);
  const [filePath, setFilePath] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFilePath((prev) =>
        prev.endsWith("/") ? prev + selectedFile.name.split(".")[0] : prev,
      );
    }
  };
  const handleUploadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (file) {
      setIsUploading(true);
      try {
        const getBasename = (path: string) => path.split(".").pop() || path;
        const fullPath = filePath.trim()
          ? `${filePath.trim()}`
          : file.name.split(".").slice(0, -1).join(".");

        const upload = await storage
          .from(selectedBucket)
          .upload(fullPath, file);

        console.log("Upload result:", upload);

        if (upload.data) {
          setFile(null);
          setFilePath("");
          setIsOpen(false);
          if (onUploadSuccess) {
            onUploadSuccess(currentPath?.id, currentPath?.level);
          }
        }
        return response(upload, true);
      } catch (error) {
        console.error(error);
        return responseError(error, true);
      } finally {
        setIsUploading(false);
      }
    } else {
      toaster({
        title: "Please select a file",
        description: "You need to select a file to upload.",
        condition: "warning",
      });
    }
  };
  const handleOpenDialog = (open: boolean) => {
    if (open && listPath.length > 0) {
      const path = listPath
        .map((p, i) => {
          return `${p.name}/`;
        })
        .join("");
      setFilePath(path);
    }
    if (!open) {
      setFile(null);
      setFilePath("");
    }
    setIsOpen(open);
  };

  console.log({ file });

  return (
    <>
      <LoadingPageWithText
        loading={isUploading}
        heading={
          loadPercentage !== null
            ? `Uploading File... ${loadPercentage.toFixed(1)}%`
            : "Uploading File..."
        }
        percentage={loadPercentage || undefined}
      />
      <Dialog
        open={isUploading ? true : isOpen}
        onOpenChange={handleOpenDialog}
      >
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Upload className="h-4 w-4" />
            Upload File
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
            <DialogDescription>
              Pilih file yang ingin Anda upload ke storage
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="file-input"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Pilih File
              </label>
              <input
                id="file-input"
                type="file"
                onChange={handleFileChange}
                disabled={isUploading}
                className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label
                htmlFor="path-input"
                className="text-sm font-medium text-gray-700 mb-2 flex flex-col"
              >
                Path Folder (opsional)
                <span className="text-sm text-gray-400 font-normal">
                  Cth : filename atau document/filename
                </span>
              </label>
              <input
                id="path-input"
                type="text"
                value={filePath}
                onChange={(e) => setFilePath(e.target.value)}
                placeholder="Cth : filename atau document/filename"
                disabled={isUploading}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                File akan disimpan di:{" "}
                {filePath.length > 0
                  ? filePath.trim()
                  : file?.name.split(".")[0]}
              </p>
            </div>

            {file && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-800">
                  <span className="font-semibold">File terpilih:</span>{" "}
                  {file.name}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Ukuran: {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isUploading}
              >
                Batal
              </Button>
              <Button type="submit" disabled={!file || isUploading}>
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
