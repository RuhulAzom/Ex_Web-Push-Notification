import type { PartialBlock } from "@blocknote/core";
import type { BlocknoteEditorType } from "./latex";

const isTextBlock = (b: PartialBlock) =>
  ["paragraph", "numberedListItem", "bulletListItem", "checkListItem", "tableCell"].includes(b.type || "");

const valid = (f: string, display: boolean) => {
  if (!f || (!display && f.includes("\n"))) return false;
  let c = 0, esc = false;
  for (const ch of f) {
    if (esc) { esc = false; continue; }
    if (ch === "\\") esc = true;
    else if (ch === "{") c++;
    else if (ch === "}") c--;
    if (c < 0) return false;
  }
  return c === 0;
};

function processBlock(block: PartialBlock, editor: BlocknoteEditorType): boolean {
  if (
    !isTextBlock(block) ||
    !Array.isArray(block.content) ||
    block.content.length === 0 ||
    !block.id
  ) return false;
  const out: any[] = [];
  let buf = "", latex = "", mode: "text"|"inline"|"block" = "text";

  for (const itm of block.content) {
    if (typeof itm === "object" && itm !== null && "type" in itm && itm.type === "text") {
      let { text = "", styles } = itm as any;
      let j = 0;
      while (j < text.length) {
        if (text[j] === "$") {
          // Cek block ($$)
          if (text[j + 1] === "$") {
            if (mode === "text") {
              if (buf) out.push({ type: "text", text: buf, styles: { ...styles } });
              buf = "";
              mode = "block";
              latex = "";
            } else if (mode === "block") {
              // Akhir block
              if (valid(latex, true)) {
                out.push({ type: "latex", props: { formula: latex, display: true } });
              } else {
                out.push({ type: "text", text: `$$${latex}$$`, styles: {} });
              }
              latex = "";
              mode = "text";
            }
            j += 2; // Lewati dua $
            continue;
          } else {
            // Inline ($)
            if (mode === "text") {
              if (buf) out.push({ type: "text", text: buf, styles: { ...styles } });
              buf = "";
              mode = "inline";
              latex = "";
            } else if (mode === "inline") {
              // Akhir inline
              if (valid(latex, false)) {
                out.push({ type: "latex", props: { formula: latex, display: false } });
              } else {
                out.push({ type: "text", text: `$${latex}$`, styles: {} });
              }
              latex = "";
              mode = "text";
            }
            j += 1; // Lewati satu $
            continue;
          }
        } else {
          if (mode === "text") buf += text[j];
          else latex += text[j];
          j++;
        }
      }
      // Sisa buffer setelah scan karakter
      if (mode === "text" && buf) out.push({ type: "text", text: buf, styles: { ...styles } });
      buf = "";
      // Kalau mode masih latex, belum tertutup
      // (jadi biarkan tetap jadi text biar user tahu kurang delimiter)
      if (mode !== "text" && latex) {
        out.push({ type: "text", text: (mode === "block" ? `$$${latex}` : `$${latex}`), styles: {} });
        latex = "";
        mode = "text";
      }
    } else {
      // Bukan tipe text, langsung push
      out.push(itm);
    }
  }

  if (JSON.stringify(out) !== JSON.stringify(block.content)) {
    // Hanya update block jika memang berubah
    const validTypes = [
      "paragraph",
      "heading",
      "quote",
      "codeBlock",
      "bulletListItem",
      "numberedListItem",
      "checkListItem"
    ] as const;
    const type: typeof validTypes[number] | undefined = validTypes.includes(block.type as any) ? block.type as typeof validTypes[number] : undefined;
    editor.updateBlock({ id: block.id }, { content: out, type });
    return true;
  }
  return false;
}


export const processAllLatex = (editor: BlocknoteEditorType) => {
  let cnt = 0;
  editor.topLevelBlocks.forEach(b => {
    const recur = (blk: PartialBlock) => {
      if (processBlock(blk, editor)) cnt++;
      blk.children?.forEach(c => recur(c as PartialBlock));
      if (blk.type === "table" && Array.isArray(blk.content))
        for (const row of blk.content)
          if (row && Array.isArray((row as any).content))
            for (const cell of (row as any).content)
              recur(cell as PartialBlock);
    };
    recur(b as PartialBlock);
  });
  return cnt;
};
