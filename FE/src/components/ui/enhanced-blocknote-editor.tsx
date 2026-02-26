import type React from "react";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wand2, ImagePlus, Loader2 } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import type { BlocknoteEditorType } from "./blocknote-editor/latex";
import BlocknoteEditor from "./blocknote-editor";
import CustomPromptDialog from "./custom-prompt-dialog";

// Simple cleanMarkdownExport passthrough (customize as needed)
function cleanMarkdownExport(md: string): string {
  return md;
}

interface EnhancedBlockNoteEditorProps {
  title?: string;
  content: string;
  onContentChange: (content: string) => void;
  onAIFix?: () => void;
  onAIFixStyle?: () => void;
  onCustomPrompt?: (prompt: string, images: string[]) => void;
  isFixing?: boolean;
  isFixingStyle?: boolean;
  isCustomPrompting?: boolean;
  placeholder?: string;
  readOnly?: boolean;
  aiButtonClassName?: string;
  aiStyleButtonClassName?: string;
  customPromptButtonClassName?: string;
  defaultCustomPrompt?: string;
}

export default function EnhancedBlockNoteEditor({
  title = "",
  content,
  onContentChange,
  onAIFix,
  onAIFixStyle,
  onCustomPrompt,
  isFixing = false,
  isFixingStyle = false,
  isCustomPrompting = false,
  placeholder = "Masukkan konten di sini...",
  readOnly = false,
  aiButtonClassName = "",
  aiStyleButtonClassName = "",
  customPromptButtonClassName = "",
  defaultCustomPrompt = "",
}: EnhancedBlockNoteEditorProps) {
  const [editor, setEditor] = useState<BlocknoteEditorType | null>(null);
  const editorRef = useRef<BlocknoteEditorType | null>(null);
  const lastContentRef = useRef<string>("");
  const isInitializedRef = useRef(false);
  const isUpdatingRef = useRef(false);
  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false);

  // Hidden file input untuk tombol Upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  const safeContent = useMemo(() => {
    const val = String(content || "");
    return val;
  }, [content]);

  useEffect(() => {
    if (!isInitializedRef.current && safeContent) {
      lastContentRef.current = safeContent;
      isInitializedRef.current = true;
    }
  }, [safeContent]);

  const handleEditorReady = useCallback((inst: BlocknoteEditorType) => {
    if (editorRef.current !== inst) {
      editorRef.current = inst;
      setEditor(inst);
    }
  }, []);

  // PERBAIKAN: Gunakan custom serializer yang mempertahankan LaTeX
  const getContentWithLatex = useCallback(
    async (editorInstance: BlocknoteEditorType) => {
      try {
        // PATCH BLOK LATEX SEBELUM SERIALISASI
        const blocks = editorInstance.document;
        const patchedBlocks = patchLatexToText(blocks);

        // Gunakan blocksToMarkdownLossy dengan blok yang sudah dipatch
        const contentWithLatex = await editorInstance.blocksToMarkdownLossy(
          patchedBlocks
        );
        return cleanMarkdownExport(contentWithLatex);
      } catch (error) {
        console.error("Error getting content:", error);
        return "";
      }
    },
    []
  );

  // PERBAIKAN FINAL: Jangan pernah trigger onContentChange jika hasil serialisasi markdown sama PERSIS (termasuk trailing newline) dengan prop content (safeContent).
  // Juga, jangan update lastContentRef kecuali memang ada perubahan dari editor.

  const debounced = useDebouncedCallback(
    async (editorInstance: BlocknoteEditorType) => {
      if (isUpdatingRef.current || readOnly) {
        return;
      }

      try {
        const val = await getContentWithLatex(editorInstance);

        // Bandingkan persis, tanpa normalisasi, tanpa trim, tanpa replace.
        if (val !== safeContent) {
          // Hanya trigger jika benar-benar berbeda
          lastContentRef.current = val;
          onContentChange(val);
        }
        // Jika sama persis, jangan update lastContentRef, jangan trigger apapun.
      } catch (error) {
        console.error("Error in debounced content change:", error);
      }
    },
    0
  );

  const handleValueChange = useCallback((val: string) => {}, []);

  const handleEditorChange = useCallback(
    (editorInstance: BlocknoteEditorType) => {
      handleEditorReady(editorInstance);

      // Set up content change handling dengan LaTeX preservation
      if (!readOnly && !isUpdatingRef.current) {
        debounced(editorInstance);
      }
    },
    [handleEditorReady, debounced, readOnly]
  );

  // Jika content di luar berubah, update editor
  useEffect(() => {
    if (
      isInitializedRef.current &&
      safeContent !== lastContentRef.current &&
      !isUpdatingRef.current
    ) {
      isUpdatingRef.current = true;
      lastContentRef.current = safeContent;
      // console.log("External content change detected:", safeContent)

      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 100);
    }
  }, [safeContent]);

  // Handle external content changes (dari AI response)
  useEffect(() => {
    if (safeContent !== lastContentRef.current && !isUpdatingRef.current) {
      isUpdatingRef.current = true;
      lastContentRef.current = safeContent;

      if (editorRef.current && safeContent) {
        setTimeout(async () => {
          try {
            const blocks = await editorRef.current!.tryParseMarkdownToBlocks(
              safeContent
            );
            const currentBlocks = editorRef.current!.document;
            const blockIds = currentBlocks.map((block) => block.id);
            editorRef.current!.replaceBlocks(blockIds, blocks as any);
          } catch (error) {
            console.error("Error updating editor with AI response:", error);
          } finally {
            isUpdatingRef.current = false;
          }
        }, 50);
      } else {
        isUpdatingRef.current = false;
      }
    }
  }, [safeContent]);

  // Handle user pilih file via tombol
  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !editorRef.current) return;

      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        const inst = editorRef.current!;

        try {
          const md = `![image](${dataUrl})`;
          const blocks = await inst.tryParseMarkdownToBlocks(md);
          const { block: cursorBlock } = inst.getTextCursorPosition();
          inst.insertBlocks(blocks, cursorBlock, "after");

          const newMd = await getContentWithLatex(inst);
          onContentChange(newMd);
        } catch (error) {
          console.error("Error inserting image:", error);
        }
      };

      reader.readAsDataURL(file);
      e.target.value = "";
    },
    [onContentChange, getContentWithLatex]
  );

  // Handle drag & drop gambar ke area CardContent
  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!editorRef.current) return;

      const file = e.dataTransfer.files?.[0];
      if (!file || !file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        const inst = editorRef.current!;

        try {
          const md = `![image](${dataUrl})`;
          const blocks = await inst.tryParseMarkdownToBlocks(md);
          const { block: cursorBlock } = inst.getTextCursorPosition();
          inst.insertBlocks(blocks, cursorBlock, "after");

          const newMd = await getContentWithLatex(inst);
          onContentChange(newMd);
        } catch (error) {
          console.error("Error dropping image:", error);
        }
      };

      reader.readAsDataURL(file);
    },
    [onContentChange, getContentWithLatex]
  );

  // Handle paste gambar dari clipboard
  const handlePaste = useCallback(
    async (e: React.ClipboardEvent<HTMLDivElement>) => {
      if (!editorRef.current) return;

      const items = Array.from(e.clipboardData.items || []);

      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = async () => {
              const dataUrl = reader.result as string;
              const inst = editorRef.current!;

              try {
                const md = `![image](${dataUrl})`;
                const blocks = await inst.tryParseMarkdownToBlocks(md);
                const { block: cursorBlock } = inst.getTextCursorPosition();
                inst.insertBlocks(blocks, cursorBlock, "after");

                const newMd = await getContentWithLatex(inst);
                onContentChange(newMd);
              } catch (error) {
                console.error("Error pasting image:", error);
              }
            };

            reader.readAsDataURL(file);
            e.preventDefault();
            break; // Only handle the first image
          }
        }
      }
    },
    [onContentChange, getContentWithLatex]
  );

  const editorNode = useMemo(() => {
    return (
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onPaste={handlePaste}
      >
        <BlocknoteEditor
          value={safeContent}
          onValueChange={handleValueChange}
          onChange={handleEditorChange}
          viewOnly={readOnly}
          isMarkdown={true}
          className={`${readOnly ? (title === "" ? "border-0 p-0" : "") : ""}`}
          placeholder={placeholder}
          editorType={
            title
              ? `enhanced-${title.toLowerCase().replace(/\s+/g, "-")}`
              : "enhanced"
          }
        />
      </div>
    );
  }, [
    safeContent,
    handleValueChange,
    handleEditorChange,
    readOnly,
    title,
    placeholder,
    handleDrop,
    handlePaste,
  ]);

  return (
    <Card>
      {title && (
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{title}</CardTitle>
            <div className="flex items-center gap-2">
              {!readOnly && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 bg-transparent hover:bg-gray-50"
                  >
                    <ImagePlus className="h-4 w-4" />
                  </Button>
                </>
              )}
              {(onAIFix || onAIFixStyle || onCustomPrompt) && !readOnly && (
                <>
                  {onAIFixStyle && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onAIFixStyle}
                      disabled={isFixingStyle}
                      className={`flex items-center gap-1 transition-all text-xs px-2 py-1 h-7 ${aiStyleButtonClassName}`}
                      style={
                        isFixingStyle
                          ? { minWidth: 60, pointerEvents: "auto" }
                          : {}
                      }
                    >
                      {isFixingStyle ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Wand2 className="h-3 w-3" />
                      )}
                      <span>{isFixingStyle ? "..." : "Style"}</span>
                    </Button>
                  )}
                  {onAIFix && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onAIFix}
                      disabled={isFixing}
                      className={`flex items-center gap-1 transition-all text-xs px-2 py-1 h-7 ${aiButtonClassName}`}
                      style={
                        isFixing ? { minWidth: 60, pointerEvents: "auto" } : {}
                      }
                    >
                      {isFixing ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Wand2 className="h-3 w-3" />
                      )}
                      <span>{isFixing ? "..." : "Fix"}</span>
                    </Button>
                  )}
                  {onCustomPrompt && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsCustomDialogOpen(true)}
                      disabled={isCustomPrompting}
                      className={`flex items-center gap-1 transition-all text-xs px-2 py-1 h-7 ${customPromptButtonClassName}`}
                      style={
                        isCustomPrompting
                          ? { minWidth: 60, pointerEvents: "auto" }
                          : {}
                      }
                    >
                      {isCustomPrompting ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Wand2 className="h-3 w-3" />
                      )}
                      <span>{isCustomPrompting ? "..." : "Custom"}</span>
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </CardHeader>
      )}

      <CardContent className={title ? "" : "p-2"}>{editorNode}</CardContent>

      {/* Custom Prompt Dialog */}
      {onCustomPrompt && (
        <CustomPromptDialog
          isOpen={isCustomDialogOpen}
          onOpenChange={setIsCustomDialogOpen}
          defaultPrompt={defaultCustomPrompt}
          onSubmit={onCustomPrompt}
          isLoading={isCustomPrompting}
          title={`Custom AI - ${title || "Editor"}`}
        />
      )}
    </Card>
  );
}

function patchLatexToText(blocks: any[]): any[] {
  return blocks.map((block) => {
    const newBlock = { ...block };
    if (Array.isArray(newBlock.content)) {
      newBlock.content = newBlock.content.map((item: any) => {
        if (item.type === "latex") {
          return {
            type: "text",
            text: item.props.display
              ? `$$${item.props.formula}$$`
              : `$${item.props.formula}$`,
            styles: {},
          };
        }
        return item;
      });
    }
    if (Array.isArray(newBlock.children)) {
      newBlock.children = patchLatexToText(newBlock.children);
    }
    return newBlock;
  });
}
