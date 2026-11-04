import { describe, expect, it } from "vitest";
import { getAppLocation } from "./functions";

const sdk = (location: object) => ({ location } as never);

describe("getAppLocation", () => {
  it("names the first location that has content", () => {
    expect(getAppLocation(sdk({ CustomField: { field: {} } }))).toBe("CustomField");
  });

  it("skips empty locations", () => {
    expect(getAppLocation(sdk({ DashboardWidget: {}, CustomField: { field: {} } }))).toBe("CustomField");
  });

  it("returns an empty name when no location has content", () => {
    expect(getAppLocation(sdk({ DashboardWidget: {} }))).toBe("");
  });
});
