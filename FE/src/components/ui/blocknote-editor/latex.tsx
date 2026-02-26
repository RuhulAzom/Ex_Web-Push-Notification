import type React from "react";
import {
  type BlockNoteEditor,
  BlockNoteSchema,
  type BlockSchemaFromSpecs,
  defaultBlockSpecs,
  defaultInlineContentSpecs,
  defaultStyleSpecs,
  type InlineContentSchemaFromSpecs,
  type StyleSchemaFromSpecs,
} from "@blocknote/core";
import { createReactInlineContentSpec } from "@blocknote/react";
import "katex/dist/katex.min.css";
import { useEffect, useRef } from "react";

// Type untuk editor
export type BlocknoteEditorType = BlockNoteEditor<
  BlockSchemaFromSpecs<typeof defaultBlockSpecs>,
  InlineContentSchemaFromSpecs<typeof inlineContentSpecs>,
  StyleSchemaFromSpecs<typeof defaultStyleSpecs>
>;

// Inline LaTeX spec dengan KaTeX rendering
export const LaTeXInline = createReactInlineContentSpec(
  {
    type: "latex",
    propSchema: {
      formula: { default: "" },
      display: { default: false },
    },
    content: "none",
  },
  {
    render: (props) => {
      const { formula, display } = props.inlineContent.props;
      const latexRef = useRef<HTMLSpanElement>(null);

      // Render the LaTeX when the formula changes
      useEffect(() => {
        if (latexRef.current && (window as any).katex) {
          try {
            (window as any).katex.render(formula, latexRef.current, {
              throwOnError: false,
              displayMode: display,
            });
          } catch (error) {
            console.error("Error rendering LaTeX:", error);
            // Show the raw formula if rendering fails
            if (latexRef.current) {
              latexRef.current.textContent = formula;
            }
          }
        }
      }, [formula, display]);

      return (
        <span
          ref={latexRef}
          className={`inline-block px-1 cursor-pointer hover:bg-gray-100 rounded ${
            display ? "block w-full text-center my-2" : ""
          }`}
          title={`LaTeX: ${formula}`}
          data-formula={formula}
        />
      );
    },
  }
);

// Gabungkan dengan default specs
const inlineContentSpecs = {
  ...defaultInlineContentSpecs,
  latex: LaTeXInline,
};

// Schema editor
export const schema = BlockNoteSchema.create({
  blockSpecs: { ...defaultBlockSpecs },
  inlineContentSpecs,
  styleSpecs: { ...defaultStyleSpecs },
});

interface LatexProps {
  children: React.ReactNode;
  editor: BlocknoteEditorType;
  id: string;
}

export default function Latex({ children, editor, id }: LatexProps) {
  // Event listeners dengan instance-based checking
  useEffect(() => {
    if (!editor) return;

    const editorElement = document.getElementById(id);
    if (!editorElement) return;

    // Define keyListener and pasteListener functions
    const keyListener = (e: KeyboardEvent) => {
      // Optionally implement custom key handling here
    };
    const pasteListener = (e: ClipboardEvent) => {
      // Optionally implement custom paste handling here
    };

    editorElement.addEventListener("keydown", keyListener);
    editorElement.addEventListener("paste", pasteListener);

    return () => {
      editorElement.removeEventListener("keydown", keyListener);
      editorElement.removeEventListener("paste", pasteListener);
    };
  }, [editor, id]);

  return <>{children}</>;
}
