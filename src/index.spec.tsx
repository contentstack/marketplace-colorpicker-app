import ContentstackAppSDK from "@contentstack/app-sdk";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@contentstack/app-sdk", () => ({ default: { init: vi.fn() } }));
vi.mock("@datadog/browser-rum", () => ({
  datadogRum: { init: vi.fn(), addError: vi.fn(), setGlobalContextProperty: vi.fn() },
}));

// Contentstack loads the field in an iframe at <host>/#/custom-field (MKT-19729), so the real entry must route on the hash.
describe("entry", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.mocked(ContentstackAppSDK.init).mockResolvedValue({
      location: {
        CustomField: {
          field: { getData: vi.fn().mockResolvedValue(null), setData: vi.fn() },
          frame: { updateHeight: vi.fn() },
        },
      },
      getConfig: vi.fn().mockResolvedValue({}),
      pulse: vi.fn(),
      stack: { _data: { api_key: "k" } },
      currentUser: { defaultOrganization: "o" },
    } as never);
    document.body.innerHTML = '<div id="root"></div>';
  });

  it.each([
    ["/#/custom-field", "hash URL"],
    ["/custom-field", "path URL"],
  ])("renders the colour field at %s (%s)", async (url) => {
    window.history.pushState({}, "", url);
    await import("./index");
    await vi.waitFor(() => expect(document.querySelector("#color-picker .swatch")).not.toBeNull());
  });

  it("keeps the query string when moving a path URL onto the hash", async () => {
    window.history.pushState({}, "", "/custom-field?a=1");
    await import("./index");
    expect(window.location.hash).toBe("#/custom-field?a=1");
  });
});
