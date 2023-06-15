// global-setup.ts
import { chromium, FullConfig } from "@playwright/test";
import { LoginPage } from "./login";
import { getAuthToken } from "../e2e/utils/prehelpers";

async function globalSetup(config: FullConfig) {
  let loginPage: LoginPage;
  const browser = await chromium.launch();
  const page = await browser.newPage({
    httpCredentials: {
      username: process.env.BASIC_AUTH_USERNAME || "",
      password: process.env.BASIC_AUTH_PASSWORD || "",
    },
  });
  loginPage = new LoginPage(page);
  await loginPage.visitLoginPage();
  await loginPage.performLogin(process.env.BASIC_AUTH_USERNAME, process.env.BASIC_AUTH_PASSWORD);
  await getAuthToken();
}

export default globalSetup;