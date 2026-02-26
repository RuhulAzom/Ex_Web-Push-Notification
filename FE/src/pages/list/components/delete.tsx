import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { storage, type ListDataType } from "@/lib/utils/storage";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { useAppProvider } from "@/components/provider/provider-app/provider-app";
import { response, responseError } from "@/lib/utils/response";
import { toaster } from "@/components/ui/toaster";

export function DeleteDialog({
  onDeleteSuccess,
  selectedFiles,
}: {
  onDeleteSuccess?: (folderId?: number, folderLevel?: number) => void;
  selectedFiles?: ListDataType[];
}) {
  const {
    useBucket: { selectedBucket },
    usePathFile: { currentPath },
  } = useAppProvider();
  const [deleteInput, setDeleteInput] = useState<string>("");
  const [filesToDelete, setFilesToDelete] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (selectedFiles && selectedFiles.length > 0) {
      setFilesToDelete(selectedFiles.map((file) => file.path));
    }
  }, [selectedFiles]);

  const handleAddFile = () => {
    if (deleteInput.trim()) {
      setFilesToDelete([...filesToDelete, deleteInput.trim()]);
      setDeleteInput("");
    }
  };

  const handleRemoveFile = (index: number) => {
    setFilesToDelete(filesToDelete.filter((_, i) => i !== index));
  };

  const handleDeleteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (filesToDelete.length > 0) {
      setIsDeleting(true);
      try {
        const deleteResult = await storage
          .from(selectedBucket)
          .remove(filesToDelete);

        console.log("Delete result:", deleteResult);

        if (deleteResult.data) {
          toaster({
            title: "Success",
            description: `Successfully deleted ${filesToDelete.length} file(s).`,
            condition: "success",
          });
          setFilesToDelete([]);
          setIsOpen(false);
          if (onDeleteSuccess) {
            onDeleteSuccess(currentPath?.id, currentPath?.level);
          }
        }

        return response(deleteResult);
      } catch (error) {
        console.error(error);
        return responseError(error, true);
      } finally {
        setIsDeleting(false);
      }
    } else {
      toaster({
        title: "Please add at least one file to delete",
        description: "You need to specify at least one file path to delete.",
        condition: "warning",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddFile();
    }
  };

  return (
    <Dialog open={isDeleting ? true : isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="gap-2">
          <Trash2 className="h-4 w-4" />
          Delete File
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete File</DialogTitle>
          <DialogDescription>
            Masukkan path file yang ingin Anda hapus dari storage
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleDeleteSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="delete-input"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Path File (contoh: document/file.pdf)
            </label>
            <div className="flex gap-2">
              <input
                id="delete-input"
                type="text"
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Masukkan path file..."
                disabled={isDeleting}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <Button
                type="button"
                onClick={handleAddFile}
                disabled={isDeleting}
                variant="destructive"
              >
                Tambah
              </Button>
            </div>
          </div>

          {filesToDelete.length > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm font-semibold text-red-800 mb-2">
                File yang akan dihapus ({filesToDelete.length}):
              </p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {filesToDelete.map((filePath, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white p-2 rounded border border-red-100"
                  >
                    <span className="text-sm text-gray-700 truncate flex-1">
                      {filePath}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      disabled={isDeleting}
                      className="text-red-600 hover:text-red-700 font-semibold text-sm ml-2 disabled:opacity-50"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isDeleting}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={filesToDelete.length === 0 || isDeleting}
            >
              {isDeleting
                ? "Deleting..."
                : `Delete ${
                    filesToDelete.length > 0 ? `(${filesToDelete.length})` : ""
                  }`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
