import { test } from "@playwright/test";

import {
  createApp,
  createContentType,
  createEntry,
  deleteApp,
  deleteContentType,
  entryPageFlow,
  getExtensionFieldUid,
  initializeEntry,
  installApp,
  uninstallApp,
} from "../utils/helper";

const jsonFile = require("jsonfile");

const randomTestNumber = Math.floor(Math.random() * 1000);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const savedCredentials: Record<string, any> = {};
let authToken: string;

test.beforeAll(async () => {
  const file = "data.json";
  const token = jsonFile.readFileSync(file);
  authToken = token.authToken;

  if (!authToken) {
    throw new Error("Auth token not found in data.json. Ensure global setup ran successfully.");
  }

  const { appId, appName } = await createApp(authToken, randomTestNumber);
  savedCredentials.appName = appName;
  savedCredentials.appId = appId;

  const installationId: string = await installApp(authToken, appId, process.env.STACK_API_KEY);
  if (!installationId || typeof installationId !== "string") {
    throw new Error(`App installation failed. Received: ${JSON.stringify(installationId)}`);
  }
  savedCredentials.installationId = installationId;

  const extensionUid = await getExtensionFieldUid(authToken, appName);

  const contentTypeResp = await createContentType(authToken, appName, extensionUid);
  if (!contentTypeResp?.content_type?.uid) {
    throw new Error(`Content type creation failed: ${JSON.stringify(contentTypeResp)}`);
  }
  savedCredentials.contentTypeId = contentTypeResp.content_type.uid;

  const entryResp = await createEntry(authToken, appName, contentTypeResp.content_type.uid);
  if (!entryResp?.entry?.uid) {
    throw new Error(`Entry creation failed: ${JSON.stringify(entryResp)}`);
  }
  savedCredentials.entryUid = entryResp.entry.uid;
  savedCredentials.entryTitle = entryResp.entry.title;
});

test.afterAll(async () => {
  if (savedCredentials.installationId) {
    await uninstallApp(authToken, savedCredentials.installationId);
  }
  if (savedCredentials.appId) {
    await deleteApp(authToken, savedCredentials.appId);
  }
  if (savedCredentials.contentTypeId) {
    await deleteContentType(authToken, savedCredentials.contentTypeId);
  }
});

test("#1 Validate Color Picker", async ({ page }) => {
  const { appName } = savedCredentials;
  const entryPage = await initializeEntry(page);
  await entryPageFlow(savedCredentials, entryPage);
  await entryPage.ValidateColorPickerField(appName);
  await entryPage.interactColorPicker(appName);
});
