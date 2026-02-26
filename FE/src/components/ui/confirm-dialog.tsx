import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ConfirmDialogProps {
  children: React.ReactNode;
  onClose?: () => Promise<any>;
  onConfirm: () => Promise<any>;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "confirm" | "delete";
}

export function ConfirmDialog({
  onClose,
  onConfirm,
  title = "Apakah Anda yakin?",
  description = "Tindakan ini tidak dapat dibatalkan.",
  confirmText = "Iya",
  cancelText = "Tidak",
  children,
  variant = "confirm",
}: ConfirmDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    await onConfirm();
    setIsOpen(false);
    setIsLoading(false);
  };

  return (
    <AlertDialog
      open={isLoading ? true : isOpen}
      onOpenChange={(open) => {
        if (!open && onClose) {
          onClose();
        }
        setIsOpen(open);
      }}
    >
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={cn(
              "bg-blue-600 hover:bg-blue-700",
              variant === "delete" && "bg-red-600 hover:bg-red-700"
            )}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
