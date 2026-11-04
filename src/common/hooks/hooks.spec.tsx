import type { ReactNode } from "react";
import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { datadogRum } from "@datadog/browser-rum";
import { CustomFieldExtensionContext } from "../contexts/customFieldExtensionContext";
import { MarketplaceAppContext } from "../contexts/marketplaceContext";
import { makeSdk } from "../../test-utils/sdk";
import { useAppLocation } from "./useAppLocation";
import { useCustomField } from "./useCustomField";
import { useFrame } from "./useFrame";
import { useHostUrl } from "./useHostUrl";
import { useSdkDataByPath } from "./useSdkDataByPath";

vi.mock("@datadog/browser-rum", () => ({
  datadogRum: { init: vi.fn(), addError: vi.fn(), setGlobalContextProperty: vi.fn() },
}));

const withSdk = (sdk: unknown) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <MarketplaceAppContext.Provider value={{ appSdk: sdk as never, appConfig: {} }}>
      {children}
    </MarketplaceAppContext.Provider>
  );
  return Wrapper;
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
  vi.clearAllMocks();
});

describe("useAppLocation", () => {
  it("names the active location and returns its instance", () => {
    const { sdk } = makeSdk();
    const { result } = renderHook(() => useAppLocation(), { wrapper: withSdk(sdk) });
    expect(result.current.locationName).toBe("CustomField");
    expect(result.current.location).toBe(sdk.location.CustomField);
  });

  it("returns an empty name when the SDK has no location", () => {
    const { result } = renderHook(() => useAppLocation(), { wrapper: withSdk({ location: {} }) });
    expect(result.current).toEqual({ locationName: "", location: null });
  });
});

describe("useCustomField", () => {
  it("returns the context value, setter and loading flag", () => {
    const setFieldData = vi.fn();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <CustomFieldExtensionContext.Provider value={{ customField: { a: 1 }, setFieldData, loading: true }}>
        {children}
      </CustomFieldExtensionContext.Provider>
    );
    expect(renderHook(() => useCustomField(), { wrapper }).result.current).toEqual([{ a: 1 }, setFieldData, true]);
  });

  it("falls back to null data and a no-op setter without a provider", async () => {
    const [data, set, loading] = renderHook(() => useCustomField()).result.current;
    expect([data, loading]).toEqual([null, false]);
    await expect(set("x")).resolves.toBeUndefined();
  });
});

describe("useJSErrorTracking", () => {
  it("skips datadog in development and reports otherwise", async () => {
    vi.stubEnv("MODE", "development");
    const dev = await import("./useJSErrorTracking");
    renderHook(() => dev.useJSErrorTracking().trackError(new Error("x")));
    expect(datadogRum.addError).not.toHaveBeenCalled();

    vi.resetModules();
    vi.stubEnv("MODE", "production");
    const prod = await import("./useJSErrorTracking");
    const e = new Error("y");
    renderHook(() => prod.useJSErrorTracking().trackError(e));
    const { datadogRum: fresh } = await import("@datadog/browser-rum");
    expect(fresh.addError).toHaveBeenCalledWith(e);
  });
});

describe("useSdkDataByPath", () => {
  it("reads the value at the path, else the default", () => {
    const { sdk } = makeSdk();
    const read = (path: string) =>
      renderHook(() => useSdkDataByPath(path, "none"), { wrapper: withSdk(sdk) }).result.current;
    expect(read("stack._data.api_key")).toBe(sdk.stack._data.api_key);
    expect(read("stack._data.missing")).toBe("none");
  });
});

describe("useFrame", () => {
  it("returns the CustomField location, which carries the frame", () => {
    const { sdk } = makeSdk();
    const { result } = renderHook(() => useFrame(), { wrapper: withSdk(sdk) });
    expect(result.current).toBe(sdk.location.CustomField);
  });

  it("throws at a location that has no frame", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      renderHook(() => useFrame(), { wrapper: withSdk({ location: { SidebarWidget: { entry: {} } } }) })
    ).toThrow("useFrame hook cannot be used at SidebarWidget location");
  });
});

describe("useHostUrl", () => {
  const hostFor = (origin: string) => {
    vi.stubGlobal("location", { ancestorOrigins: [origin] });
    return renderHook(() => useHostUrl()).result.current;
  };

  afterEach(() => vi.unstubAllGlobals());

  it("maps the app host to the cdn host and the .com domain to .io", () => {
    expect(hostFor("https://app.contentstack.com")).toBe("https://cdn.contentstack.io");
  });

  it("keeps the domain for eu and azure hosts", () => {
    expect(hostFor("https://eu-app.contentstack.com")).toBe("https://eu-cdn.contentstack.com");
    expect(hostFor("https://azure-na-app.contentstack.com")).toBe("https://azure-na-cdn.contentstack.com");
  });
});

describe("useAnalytics", () => {
  // resetModules gives the hook a fresh MODE and a fresh context, so the wrapper must use that same context.
  const track = async (mode: string, sdk: unknown, ...args: [string, Record<string, string>?]) => {
    vi.stubEnv("MODE", mode);
    vi.resetModules();
    const { useAnalytics } = await import("./useAnalytics");
    const { MarketplaceAppContext: Fresh } = await import("../contexts/marketplaceContext");
    const wrapper = ({ children }: { children: ReactNode }) => (
      <Fresh.Provider value={{ appSdk: sdk as never, appConfig: {} }}>{children}</Fresh.Provider>
    );
    renderHook(() => useAnalytics().trackEvent(...args), { wrapper });
  };

  it("sends the event to the SDK pulse in production, with empty data by default", async () => {
    const { sdk } = makeSdk();
    await track("production", sdk, "clicked", { a: "b" });
    await track("production", sdk, "bare");
    expect(sdk.pulse.mock.calls).toEqual([
      ["clicked", { a: "b" }],
      ["bare", {}],
    ]);
  });

  it("does not track in development", async () => {
    const { sdk } = makeSdk();
    await track("development", sdk, "clicked");
    expect(sdk.pulse).not.toHaveBeenCalled();
  });

  it("tolerates a missing SDK in production", async () => {
    await expect(track("production", null, "x")).resolves.toBeUndefined();
  });
});
