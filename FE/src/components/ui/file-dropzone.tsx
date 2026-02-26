import { useState, useCallback } from "react";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface FileDropzoneProps {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  onFilesChange: (files: File[]) => void;
  files: File[];
  disabled?: boolean;
  className?: string;
}

export function FileDropzone({
  accept = "*",
  multiple = false,
  maxFiles,
  onFilesChange,
  files,
  disabled = false,
  className,
}: FileDropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;

    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  }, [disabled]);

  const handleFiles = useCallback((newFiles: File[]) => {
    let validFiles = newFiles;

    // Filter by accept type
    if (accept !== "*") {
      const acceptTypes = accept.split(",").map((type) => type.trim());
      validFiles = newFiles.filter((file) => {
        return acceptTypes.some((type) => {
          if (type.startsWith(".")) {
            return file.name.toLowerCase().endsWith(type.toLowerCase());
          }
          return file.type.match(new RegExp(type.replace("*", ".*")));
        });
      });
    }

    if (multiple) {
      const currentFiles = [...files];
      const combined = [...currentFiles, ...validFiles];

      // Apply maxFiles limit
      const finalFiles = maxFiles ? combined.slice(0, maxFiles) : combined;
      onFilesChange(finalFiles);
    } else {
      onFilesChange(validFiles.slice(0, 1));
    }
  }, [accept, multiple, files, maxFiles, onFilesChange]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      if (disabled) return;

      const droppedFiles = Array.from(e.dataTransfer.files);
      handleFiles(droppedFiles);
    },
    [disabled, handleFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;

      const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
      handleFiles(selectedFiles);

      // Reset input
      e.target.value = "";
    },
    [disabled, handleFiles]
  );

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 transition-colors",
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          id="file-input"
        />
        <div className="flex flex-col items-center justify-center text-center">
          <Upload
            className={cn(
              "w-12 h-12 mb-4",
              isDragActive ? "text-blue-500" : "text-gray-400"
            )}
          />
          <p className="text-sm font-medium text-gray-700 mb-1">
            {isDragActive ? "Drop files here" : "Drag & drop files here"}
          </p>
          <p className="text-xs text-gray-500 mb-4">or click to browse</p>
          {accept !== "*" && (
            <p className="text-xs text-gray-400">Accepted: {accept}</p>
          )}
          {multiple && maxFiles && (
            <p className="text-xs text-gray-400 mt-1">
              Max {maxFiles} files
            </p>
          )}
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Selected files ({files.length}):
          </p>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  disabled={disabled}
                  className="ml-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
