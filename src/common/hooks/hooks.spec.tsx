import type { ReactNode } from "react";
import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { datadogRum } from "@datadog/browser-rum";
import { CustomFieldExtensionContext } from "../contexts/customFieldExtensionContext";
import { MarketplaceAppContext } from "../contexts/marketplaceContext";
import { makeSdk } from "../../test-utils/sdk";
import { useAppLocation } from "./useAppLocation";
import { useCustomField } from "./useCustomField";

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
