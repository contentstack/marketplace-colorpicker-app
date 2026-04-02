import { expect, FrameLocator, Locator, Page } from "@playwright/test";
import initParams from "../fixtures/initParams.json";

export class EntryPage {
  readonly page: Page;
  readonly entriesPage: Locator;
  readonly saveButton: Locator;
  readonly widgetLocator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.entriesPage = page.locator('svg[name="Entries"]');
    this.saveButton = page.locator('button:has-text("Save")');
    this.widgetLocator = page.locator('svg[name="Widgets"]');
  }

  async navigateToDashboard() {
    await this.page.goto(`/#!/stack/${process.env.STACK_API_KEY}/dashboard`);
    await this.page.waitForLoadState();
  }

  async navigateToEntry(apiKey: string, contentTypeUID: string, entryUID: string) {
    await this.page.goto(`/#!/stack/${apiKey}/content-type/${contentTypeUID}/en-us/entry/${entryUID}/edit`);
    await this.page.waitForLoadState();
  }

  async widgetSelector() {
    await this.widgetLocator.click();
  }

  private getCustomFieldFrame(appName: string): FrameLocator {
    return this.page.frameLocator(`iframe[title="${initParams.customFieldTitlePrefix}${appName}"]`);
  }

  async validateDashboardWidget() {
    const frame = this.page.frameLocator("div.cs-extension iframe");
    const locateText = frame.locator('text="Dashboard Widget"');
    await expect(locateText).toHaveText("Dashboard Widget");
  }

  async ValidateColorPickerField(appName: string) {
    const frame = this.getCustomFieldFrame(appName);
    const colorPicker: Locator = frame.locator(".layout-container").first();
    await expect(colorPicker).toBeVisible({ timeout: 30_000 });
  }

  async interactColorPicker(appName: string) {
    const frame = this.getCustomFieldFrame(appName);

    const swatch: Locator = frame.locator(".layout-container .swatch").first();
    await expect(swatch).toBeVisible();
    await swatch.click();

    const popover: Locator = frame.locator(".layout-container .popover").first();
    await expect(popover).toBeVisible();

    const hexInput: Locator = popover.getByLabel("hex");
    const rInput: Locator = popover.getByLabel("r", { exact: true });
    const gInput: Locator = popover.getByLabel("g", { exact: true });
    const bInput: Locator = popover.getByLabel("b", { exact: true });
    const aInput: Locator = popover.getByLabel("a", { exact: true });

    await expect(hexInput).toBeVisible();
    await expect(rInput).toBeVisible();
    await expect(gInput).toBeVisible();
    await expect(bInput).toBeVisible();
    await expect(aInput).toBeVisible();

    await hexInput.click();
    await hexInput.fill("A1F02E");

    await expect(rInput).toHaveValue("161");
    await expect(gInput).toHaveValue("240");
    await expect(bInput).toHaveValue("46");
    await expect(aInput).toHaveValue("100");
  }
}
