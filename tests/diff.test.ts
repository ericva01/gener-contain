import { describe, expect, it } from "vitest";
import { diffFiles, diffLines } from "@/lib/diff";

describe("configuration diff", () => {
  it("marks changed lines", () => expect(diffLines("one\ntwo", "one\nthree").map((line) => line.kind)).toEqual(["same", "remove", "add"]));
  it("reports added, removed, and changed files", () => {
    const before = [{ path: "a", language: "text", content: "old" }, { path: "gone", language: "text", content: "x" }];
    const after = [{ path: "a", language: "text", content: "new" }, { path: "new", language: "text", content: "x" }];
    expect(diffFiles(before, after).map(({ path, status }) => [path, status])).toEqual([["a", "changed"], ["gone", "removed"], ["new", "added"]]);
  });
});
