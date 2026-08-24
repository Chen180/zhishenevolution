import { describe, expect, it } from "vitest";
import { createHealthStatus } from "../../lib/domain/health";

describe("createHealthStatus", () => {
  it("returns a stable UTC timestamp", () => {
    const now = new Date("2026-01-02T03:04:05.000Z");

    expect(createHealthStatus(now)).toEqual({
      status: "ok",
      timestamp: "2026-01-02T03:04:05.000Z",
    });
  });
});
