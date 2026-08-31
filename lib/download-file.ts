import type { GeneratedFile } from "@/types/generator";
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url; anchor.download = filename; anchor.click();
  URL.revokeObjectURL(url);
}
export function downloadFile(file: GeneratedFile) { downloadBlob(new Blob([file.content], { type: "text/plain;charset=utf-8" }), file.path.split("/").at(-1) ?? "config.txt"); }
