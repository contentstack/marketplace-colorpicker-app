import { Locator, Page, Frame } from '@playwright/test';


export class colorPickerApp {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async openColorApp() {
    await this.page
    .goto(`${process.env.APP_BASE_URL}/#!/stack/${process.env.STACK_UID}/content-type/test_json_editor/en-us/entry/create`);
  }

  async changeColorbyDraging(){
    await this.page.frameLocator('[data-testid="app-extension-frame"]').locator('.swatch > div').click();
    await this.page.frameLocator('[data-testid="app-extension-frame"]').locator('.hue-horizontal').click();
    await this.page.frameLocator('[data-testid="app-extension-frame"]').locator('div:nth-child(3)').first().click();
  }

  async changeHexColor() {
    await this.page.frameLocator('[data-testid="app-extension-frame"]').getByLabel('hex').click();
    await this.page.frameLocator('[data-testid="app-extension-frame"]').getByLabel('hex').fill('7E7');
    await this.page.frameLocator('[data-testid="app-extension-frame"]').getByLabel('hex').press('CapsLock');
    await this.page.frameLocator('[data-testid="app-extension-frame"]').getByLabel('hex').fill('XDF7E7');
  }

  async changeSaturation(){
    await this.page.frameLocator('[data-testid="app-extension-frame"]').locator('.saturation-black').click();
  }

  async changeBasicColor() {
    await this.page.frameLocator('[data-testid="app-extension-frame"]').getByTitle('#D0021B').click();
    await this.page.frameLocator('[data-testid="app-extension-frame"]').getByTitle('#8B572A').click();
    await this.page.frameLocator('[data-testid="app-extension-frame"]').getByTitle('#417505').click();
 
  }

}