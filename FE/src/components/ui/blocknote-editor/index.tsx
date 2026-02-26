import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { useDebouncedCallback } from "use-debounce";
import Latex, { type BlocknoteEditorType, schema } from "./latex";
import { processAllLatex } from "./latex-helper";
import "./style.css";
import { v4 as uuid } from "uuid";
import { Button } from "../button";
import { toast } from "sonner";
import { Badge } from "../badge";

// Utility functions
function cleanMarkdownExport(markdown: string): string {
  return markdown;
}

// Extend BlockNoteEditor type with custom methods
declare module "@blocknote/core" {
  interface BlockNoteEditor {
    processLatexInAllBlockTypes?: () => number;
    blocksToMarkdownWithLatex?: (blocks?: any[]) => string;
  }
}

export default function BlocknoteEditor({
  value,
  onValueChange,
  onChange,
  viewOnly,
  className,
  isMarkdown,
  placeholder,
  editorType = "default",
}: {
  value?: string;
  onValueChange?: (value: string) => void;
  onChange?: (editor: BlocknoteEditorType) => void;
  viewOnly?: boolean;
  className?: string;
  isMarkdown?: boolean;
  placeholder?: string;
  editorType?: string;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const id = uuid();
  const [isClient, setIsClient] = useState(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const lastValueRef = useRef<string>("");
  const isProcessingRef = useRef<boolean>(false);

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const editor = useCreateBlockNote({
    schema,
    placeholders: {
      default: placeholder || "Ketik di sini...",
    },
    // Always start with default content, we'll load the actual content in getValue
    initialContent: [{ type: "paragraph", content: [] }],
  });

  // Add custom methods to editor
  useEffect(() => {
    if (editor) {
      // Add the processLatexInAllBlockTypes method to the editor object
      editor.processLatexInAllBlockTypes = () => processAllLatex(editor);

      // Pass editor instance to parent component
      if (onChange) onChange(editor);
    }
  }, [editor, onChange]);

  // Perbaiki getValue function untuk menggunakan parser LaTeX yang lebih baik
  const getValue = async (value?: string) => {
    if (value === undefined || isProcessingRef.current) return;

    // Cegah re-processing jika value sama
    if (lastValueRef.current === value && isInitialized) return;

    isProcessingRef.current = true;

    try {
      let initialValue;

      if (value) {
        if (isMarkdown) {
          initialValue = await editor.tryParseMarkdownToBlocks(value);
        } else {
          initialValue = await editor.tryParseHTMLToBlocks(value);
        }

        const ids = editor.document.map((item) => item.id);
        editor.replaceBlocks(ids, initialValue as any);
      }

      // Selalu proses LaTeX untuk semua editor, baik viewOnly maupun editable
      setTimeout(() => {
        processAllLatex(editor);
      }, 150); // Sedikit delay untuk memastikan blocks sudah ter-render

      lastValueRef.current = value || "";
      setIsInitialized(true);
    } catch (error) {
      console.error("Error processing content:", error);
    } finally {
      isProcessingRef.current = false;
    }
  };

  // handleOnChange: Jangan pernah trigger onValueChange jika newValue === lastValueRef.current (identik, tanpa trim/replace apapun)
  const handleOnChange = useDebouncedCallback(async () => {
    if (!onValueChange || isProcessingRef.current || viewOnly) return;

    try {
      let newValue;

      if (isMarkdown) {
        if (editor.blocksToMarkdownWithLatex) {
          newValue = editor.blocksToMarkdownWithLatex();
        } else {
          newValue = await editor.blocksToMarkdownLossy(editor.document);
        }
      } else {
        newValue = await editor.blocksToFullHTML(editor.document);
      }

      // Hanya trigger jika benar-benar berbeda (tanpa trim/replace)
      if (newValue !== lastValueRef.current) {
        lastValueRef.current = newValue;
        onValueChange(newValue);
      }

      if (onChange) {
        console.log({ id, editor });
        onChange(editor);
        editor.focus();
        setIsSaving(false);
      }
    } catch (error) {
      console.error("Error in handleOnChange:", error);
    }
  }, 1000);

  useEffect(() => {
    if (isClient && editor) {
      getValue(value);
    }
  }, [value, isClient, editor]);

  // Process LaTeX on initial load
  useEffect(() => {
    if (editor && isClient && value) {
      setTimeout(() => {
        processAllLatex(editor);
      }, 200);
    }
  }, [editor, isClient, value]);

  useEffect(() => {
    if (!editor || !isClient) return;

    const handleFocus = () => {
      setTimeout(() => {
        processAllLatex(editor);
      }, 100);
    };

    const handleBlur = () => {
      if (!viewOnly) {
        setTimeout(() => {
          processAllLatex(editor);
        }, 100);
      }
    };

    const editorElement = editor.domElement;

    if (editorElement) {
      editorElement.addEventListener("focus", handleFocus, true);
      editorElement.addEventListener("blur", handleBlur);
    }

    return () => {
      if (editorElement) {
        editorElement.removeEventListener("focus", handleFocus, true);
        editorElement.removeEventListener("blur", handleBlur);
      }
    };
  }, [editor, isClient, viewOnly]);

  // Only render the editor once it's created and on client
  if (!isClient || !editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="blocknote-editor-wrapper" data-editor-type={editorType}>
      {/* <Button
        onClick={() => {
          console.log({ editor: editor.focus });
          editor.focus();
        }}
      >
        editorRef
      </Button> */}
      <Latex editor={editor} id={id}>
        <BlockNoteView
          id={id}
          ref={editorRef}
          className={cn(viewOnly && "viewOnly", className)}
          editor={editor}
          theme="light"
          onChange={async () => {
            if (!viewOnly) {
              setIsSaving(true);
              handleOnChange();
            }
          }}
          editable={!viewOnly}
        />
      </Latex>

      {isSaving && onChange && (
        <Badge variant="secondary" className="animate-pulse">
          💾 Menyimpan perubahan...
        </Badge>
      )}

      {!isSaving && onChange && (
        <Badge variant="secondary" className="">
          ✓ Perubahan tersimpan
        </Badge>
      )}
    </div>
  );
}
