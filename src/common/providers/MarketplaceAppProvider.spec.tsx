import ContentstackAppSDK from "@contentstack/app-sdk";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { datadogRum } from "@datadog/browser-rum";
import { fakeId, makeSdk } from "../../test-utils/sdk";
import { useAppSdk } from "../hooks/useAppSdk";
import { MarketplaceAppProvider } from "./MarketplaceAppProvider";

vi.mock("@contentstack/app-sdk", () => ({ default: { init: vi.fn() } }));
vi.mock("@datadog/browser-rum", () => ({
  datadogRum: { init: vi.fn(), addError: vi.fn(), setGlobalContextProperty: vi.fn() },
}));

const Child = () => <p>{useAppSdk() ? "has sdk" : "no sdk"}</p>;

describe("MarketplaceAppProvider", () => {
  beforeEach(() => vi.clearAllMocks());

  it("shows Loading until the SDK resolves, then renders children with the SDK", async () => {
    vi.mocked(ContentstackAppSDK.init).mockResolvedValue(makeSdk().sdk as never);
    render(
      <MarketplaceAppProvider>
        <Child />
      </MarketplaceAppProvider>
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(await screen.findByText("has sdk")).toBeInTheDocument();
  });

  it("sets the field iframe height to 350 and sends the stack and org to error tracking", async () => {
    const { sdk } = makeSdk();
    vi.mocked(ContentstackAppSDK.init).mockResolvedValue(sdk as never);
    render(<MarketplaceAppProvider />);
    await waitFor(() => expect(sdk.location.CustomField.frame.updateHeight).toHaveBeenCalledWith(350));
    expect(datadogRum.setGlobalContextProperty).toHaveBeenCalledWith("Stack", fakeId("stack"));
    expect(datadogRum.setGlobalContextProperty).toHaveBeenCalledWith("Organization", "org");
    expect(datadogRum.setGlobalContextProperty).toHaveBeenCalledWith("User Id", "u1");
    expect(datadogRum.setGlobalContextProperty).toHaveBeenCalledWith("App Location", "CustomField");
  });

  it.each([
    ["production", 1],
    ["development", 0],
  ])("sends the init pulse event only in production (%s)", async (mode, calls) => {
    vi.stubEnv("MODE", mode);
    const { sdk } = makeSdk();
    vi.mocked(ContentstackAppSDK.init).mockResolvedValue(sdk as never);
    render(<MarketplaceAppProvider />);
    await waitFor(() => expect(sdk.location.CustomField.frame.updateHeight).toHaveBeenCalled());
    expect(sdk.pulse).toHaveBeenCalledTimes(calls);
    vi.unstubAllEnvs();
  });

  it("shows the failure screen and tracks the error when SDK init fails", async () => {
    const err = new Error("init failed");
    vi.mocked(ContentstackAppSDK.init).mockRejectedValue(err);
    render(
      <MarketplaceAppProvider>
        <Child />
      </MarketplaceAppProvider>
    );
    expect(await screen.findByRole("alert")).toHaveTextContent("support@contentstack.com");
    expect(screen.getByText("Something went wrong. Please try refreshing the page.")).toBeInTheDocument();
    expect(screen.queryByText("has sdk")).toBeNull();
    expect(datadogRum.addError).toHaveBeenCalledWith(err);
  });
});
