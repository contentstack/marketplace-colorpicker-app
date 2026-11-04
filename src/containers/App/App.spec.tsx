import ContentstackAppSDK from "@contentstack/app-sdk";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { makeSdk } from "../../test-utils/sdk";
import App from "./App";

vi.mock("@contentstack/app-sdk", () => ({ default: { init: vi.fn() } }));
vi.mock("@datadog/browser-rum", () => ({
  datadogRum: { init: vi.fn(), addError: vi.fn(), setGlobalContextProperty: vi.fn() },
}));

const at = (path: string) => {
  vi.mocked(ContentstackAppSDK.init).mockResolvedValue(makeSdk().sdk as never);
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );
};

describe("App routes", () => {
  it("/custom-field renders the colour field", async () => {
    const { container } = at("/custom-field");
    await vi.waitFor(() => expect(container.querySelector("#color-picker .swatch")).not.toBeNull());
  });

  it("/ shows the default page listing the UI locations", async () => {
    at("/");
    expect(await screen.findByText(/Nothing to show here/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Custom Field" })).toHaveAttribute("href", "/custom-field");
  });

  it("an unknown path shows the 404 page", async () => {
    at("/nope");
    expect(await screen.findByText("404: Not Found")).toBeInTheDocument();
  });
});
