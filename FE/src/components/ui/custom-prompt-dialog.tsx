"use client"

import { useState, useRef, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Wand2, Loader2, X, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"

interface CustomPromptDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  defaultPrompt: string
  onSubmit: (prompt: string, images: string[]) => void
  isLoading?: boolean
  title?: string
}

export default function CustomPromptDialog({
  isOpen,
  onOpenChange,
  defaultPrompt,
  onSubmit,
  isLoading = false,
  title = "Custom AI Prompt"
}: CustomPromptDialogProps) {
  const [prompt, setPrompt] = useState(defaultPrompt)
  const [images, setImages] = useState<File[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = useCallback(async () => {
    if (!prompt.trim()) {
      toast.error("Prompt tidak boleh kosong")
      return
    }

    // Convert images to base64
    const imageBase64Array: string[] = []
    for (const image of images) {
      try {
        const base64 = await convertFileToBase64(image)
        imageBase64Array.push(base64)
      } catch (error) {
        toast.error(`Gagal mengkonversi gambar: ${image.name}`)
        return
      }
    }

    onSubmit(prompt, imageBase64Array)
  }, [prompt, images, onSubmit])

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result)
        } else {
          reject(new Error('Failed to convert file to base64'))
        }
      }
      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(file)
    })
  }

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return

    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'))
    if (imageFiles.length === 0) {
      toast.error("Hanya file gambar yang diperbolehkan")
      return
    }

    setImages(prev => [...prev, ...imageFiles])
    toast.success(`${imageFiles.length} gambar ditambahkan`)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (file) {
          setImages(prev => [...prev, file])
          toast.success("Gambar dari clipboard ditambahkan")
        }
      }
    }
  }, [])

  const removeImage = useCallback((index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }, [handleSubmit])

  const resetDialog = useCallback(() => {
    setPrompt(defaultPrompt)
    setImages([])
    setIsDragOver(false)
  }, [defaultPrompt])

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => {
      onOpenChange(open)
      if (!open) resetDialog()
    }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image Previews */}
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    className="w-16 h-16 object-cover rounded border"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    disabled={isLoading}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Prompt Input with Drag & Drop */}
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onPaste={handlePaste}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onKeyDown={handleKeyDown}
              placeholder="Masukkan prompt custom Anda... (Ctrl+V untuk paste gambar, Ctrl+Enter untuk kirim)"
              className={`min-h-[120px] resize-y transition-colors ${
                isDragOver ? "border-blue-500 bg-blue-50" : ""
              }`}
              disabled={isLoading}
            />

            {/* Drag overlay */}
            {isDragOver && (
              <div className="absolute inset-0 border-2 border-dashed border-blue-500 bg-blue-50/80 rounded flex items-center justify-center pointer-events-none">
                <div className="flex items-center gap-2 text-blue-600">
                  <ImageIcon className="h-5 w-5" />
                  <span className="font-medium">Drop gambar di sini</span>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">
              Tip: Ctrl+V untuk paste gambar, Ctrl+Enter untuk kirim
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Batal
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading || !prompt.trim()}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" />
                    Proses AI
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
