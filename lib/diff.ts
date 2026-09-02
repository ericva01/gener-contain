import type { GeneratedFile } from "@/types/generator";

export interface DiffLine { kind: "same" | "add" | "remove"; text: string }
export interface FileDiff { path: string; status: "added" | "removed" | "changed"; lines: DiffLine[] }

export function diffLines(before: string, after: string): DiffLine[] {
  const left = before.split("\n"), right = after.split("\n");
  const table = Array.from({ length: left.length + 1 }, () => Array<number>(right.length + 1).fill(0));
  for (let i = left.length - 1; i >= 0; i--) for (let j = right.length - 1; j >= 0; j--)
    table[i][j] = left[i] === right[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
  const lines: DiffLine[] = []; let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] === right[j]) { lines.push({ kind: "same", text: left[i] }); i++; j++; }
    else if (table[i + 1][j] >= table[i][j + 1]) lines.push({ kind: "remove", text: left[i++] });
    else lines.push({ kind: "add", text: right[j++] });
  }
  while (i < left.length) lines.push({ kind: "remove", text: left[i++] });
  while (j < right.length) lines.push({ kind: "add", text: right[j++] });
  return lines;
}

export function diffFiles(before: GeneratedFile[], after: GeneratedFile[]): FileDiff[] {
  const oldFiles = new Map(before.map((file) => [file.path, file]));
  const newFiles = new Map(after.map((file) => [file.path, file]));
  return [...new Set([...oldFiles.keys(), ...newFiles.keys()])].sort().flatMap<FileDiff>((path) => {
    const oldFile = oldFiles.get(path), newFile = newFiles.get(path);
    if (!oldFile && newFile) return [{ path, status: "added" as const, lines: diffLines("", newFile.content) }];
    if (oldFile && !newFile) return [{ path, status: "removed" as const, lines: diffLines(oldFile.content, "") }];
    if (oldFile?.content !== newFile?.content) return [{ path, status: "changed" as const, lines: diffLines(oldFile!.content, newFile!.content) }];
    return [];
  });
}
