import { fireEvent, render, waitFor } from "@testing-library/react";
import type Extension from "@contentstack/app-sdk/dist/src/extension";
import { describe, expect, it, vi } from "vitest";
import { CustomFieldExtensionProvider } from "../../common/providers/CustomFieldExtensionProvider";
import { MarketplaceAppContext } from "../../common/contexts/marketplaceContext";
import { makeSdk } from "../../test-utils/sdk";
import CustomFieldExtension from "./CustomField";

vi.mock("@datadog/browser-rum", () => ({
  datadogRum: { init: vi.fn(), addError: vi.fn(), setGlobalContextProperty: vi.fn() },
}));

const renderField = (saved: unknown = null) => {
  const { sdk, setData } = makeSdk(saved);
  const utils = render(
    <MarketplaceAppContext.Provider value={{ appSdk: sdk as unknown as Extension, appConfig: {} }}>
      <CustomFieldExtensionProvider>
        <CustomFieldExtension />
      </CustomFieldExtensionProvider>
    </MarketplaceAppContext.Provider>
  );
  const swatchColour = () => (utils.container.querySelector(".swatch > div") as HTMLElement).style.background;
  const openPicker = () => fireEvent.click(utils.container.querySelector(".swatch") as HTMLElement);
  return { ...utils, sdk, setData, swatchColour, openPicker };
};

const savedRed = { hex: "#ff0000", rgb: { r: 255, g: 0, b: 0, a: 1 }, hsl: { h: 0, s: 1, l: 0.5, a: 1 } };

describe("colour custom field", () => {
  it("shows the default swatch rgb(108, 92, 231) when nothing is saved", async () => {
    const { swatchColour, sdk } = renderField(null);
    await waitFor(() => expect(sdk.location.CustomField.field.getData).toHaveBeenCalled());
    expect(swatchColour()).toBe("rgb(108, 92, 231)");
  });

  it("shows the saved colour on load", async () => {
    const { swatchColour } = renderField(savedRed);
    await waitFor(() => expect(swatchColour()).toBe("rgb(255, 0, 0)"));
  });

  it("keeps the saved alpha in the swatch", async () => {
    const { swatchColour } = renderField({ ...savedRed, rgb: { r: 255, g: 0, b: 0, a: 0.5 } });
    await waitFor(() => expect(swatchColour()).toBe("rgba(255, 0, 0, 0.5)"));
  });

  it("shows a saved colour that has no alpha as opaque", async () => {
    const { swatchColour } = renderField({ hex: "#00ff00", rgb: { r: 0, g: 255, b: 0 } });
    await waitFor(() => expect(swatchColour()).toBe("rgb(0, 255, 0)"));
  });

  it("keeps the default swatch when the saved value is not a colour object", async () => {
    const { swatchColour, sdk } = renderField("HELLO");
    await waitFor(() => expect(sdk.location.CustomField.field.getData).toHaveBeenCalled());
    expect(swatchColour()).toBe("rgb(108, 92, 231)");
  });

  it("opens the sketch picker on swatch click and closes it on a second click", () => {
    const { container, openPicker } = renderField();
    expect(container.querySelector(".popover")).toBeNull();
    openPicker();
    expect(container.querySelector(".popover .sketch-picker")).not.toBeNull();
    openPicker();
    expect(container.querySelector(".popover")).toBeNull();
  });

  it("opens the picker from the keyboard on the swatch", () => {
    const { container } = renderField();
    fireEvent.keyDown(container.querySelector(".swatch") as HTMLElement, { key: "Enter" });
    expect(container.querySelector(".popover")).not.toBeNull();
  });

  it("closes the picker when the cover behind it is clicked", () => {
    const { container, openPicker } = renderField();
    openPicker();
    fireEvent.click(container.querySelector(".popover .cover") as HTMLElement);
    expect(container.querySelector(".popover")).toBeNull();
  });

  it("closes the picker from the keyboard on the cover", () => {
    const { container, openPicker } = renderField();
    openPicker();
    fireEvent.keyDown(container.querySelector(".popover .cover") as HTMLElement, { key: "Escape" });
    expect(container.querySelector(".popover")).toBeNull();
  });

  it("saves the whole react-color ColorResult via field.setData and updates the swatch", async () => {
    const { container, openPicker, setData, swatchColour } = renderField(null);
    openPicker();
    const hexInput = container.querySelector(".popover input") as HTMLInputElement;
    fireEvent.change(hexInput, { target: { value: "#00ff00" } });

    await waitFor(() => expect(setData).toHaveBeenCalledTimes(1));
    expect(setData).toHaveBeenCalledWith(
      expect.objectContaining({
        hex: "#00ff00",
        rgb: { r: 0, g: 255, b: 0, a: 1 },
        hsl: expect.objectContaining({ h: 120 }),
        hsv: expect.any(Object),
      })
    );
    expect(swatchColour()).toBe("rgb(0, 255, 0)");
  });

  it("shows the saved colour inside the open picker", async () => {
    const { container, openPicker } = renderField(savedRed);
    await waitFor(() =>
      expect((container.querySelector(".swatch > div") as HTMLElement).style.background).toBe("rgb(255, 0, 0)")
    );
    openPicker();
    expect((container.querySelector(".popover input") as HTMLInputElement).value.toLowerCase()).toBe("ff0000");
  });
});
