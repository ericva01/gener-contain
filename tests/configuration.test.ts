import { describe, expect, it } from "vitest";
import { defaultConfig } from "@/config/defaults";
import { validateConfig } from "@/config/schema";
import { decodeSharedConfiguration, encodeSharedConfiguration, exportConfiguration, importConfiguration, isSafeArchivePath, sanitizeProjectName } from "@/lib/configuration";

describe("configuration", () => {
  it("accepts the defaults", () => expect(validateConfig(defaultConfig).success).toBe(true));
  it("allows Git-only auto-push without a Dockerfile", () => expect(validateConfig({ ...defaultConfig, includeDockerfile: false, includePublishScript: true, publishMode: "git" }).success).toBe(true));
  it("rejects unsafe names and ports", () => {
    const result = validateConfig({ ...defaultConfig, projectName: "../Bad Name", applicationPort: 70000 });
    expect(result.errors.projectName).toBeTruthy(); expect(result.errors.applicationPort).toBeTruthy();
  });
  it("imports an exported configuration", () => expect(importConfiguration(exportConfiguration(defaultConfig))).toEqual(defaultConfig));
  it("round-trips share links", () => expect(decodeSharedConfiguration(encodeSharedConfiguration({ ...defaultConfig, framework: "react" }))).toEqual({ ...defaultConfig, framework: "react" }));
  it("rejects invalid and unsupported JSON", () => {
    expect(() => importConfiguration("nope")).toThrow("not valid JSON");
    expect(() => importConfiguration('{"schemaVersion":99}')).toThrow("Unsupported configuration version");
  });
  it("sanitizes project names", () => expect(sanitizeProjectName(" ../My Cool App!! ")).toBe("my-cool-app"));
  it("recognizes safe archive paths", () => {
    expect(isSafeArchivePath(".github/workflows/ci.yml")).toBe(true);
    for (const path of ["../secret", "/root/file", "C:\\secret", "foo//bar"]) expect(isSafeArchivePath(path)).toBe(false);
  });
});
