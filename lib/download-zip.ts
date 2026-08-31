import JSZip from "jszip";
import { isSafeArchivePath, sanitizeProjectName } from "./configuration";
import { downloadBlob } from "./download-file";
import type { GeneratedFile } from "@/types/generator";
export async function downloadZip(files: GeneratedFile[], projectName: string) {
  const zip = new JSZip();
  for (const file of files) {
    if (!isSafeArchivePath(file.path)) throw new Error(`Unsafe archive path: ${file.path}`);
    zip.file(file.path.replaceAll("\\", "/"), file.content);
  }
  downloadBlob(await zip.generateAsync({ type: "blob" }), `${sanitizeProjectName(projectName)}-config.zip`);
}
