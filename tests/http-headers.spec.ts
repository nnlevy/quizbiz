import { describe, expect, it } from "vitest";
import { appendVary } from "../src/shared/httpHeaders";

describe("appendVary", () => {
  it("sets Vary when missing", () => {
    const headers = new Headers();
    appendVary(headers, "Accept-Encoding");
    expect(headers.get("Vary")).toBe("Accept-Encoding");
  });

  it("preserves existing Vary values", () => {
    const headers = new Headers({ Vary: "Origin" });
    appendVary(headers, "Accept-Encoding");
    expect(headers.get("Vary")).toBe("Origin, Accept-Encoding");
  });

  it("does not duplicate Accept-Encoding", () => {
    const headers = new Headers({ Vary: "Origin, accept-encoding" });
    appendVary(headers, "Accept-Encoding");
    expect(headers.get("Vary")).toBe("Origin, accept-encoding");
  });

  it("keeps wildcard Vary", () => {
    const headers = new Headers({ Vary: "*" });
    appendVary(headers, "Accept-Encoding");
    expect(headers.get("Vary")).toBe("*");
  });
});
