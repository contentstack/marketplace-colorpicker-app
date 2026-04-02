// module dependencies
import { Page } from "@playwright/test";
import { EntryPage } from "../pages/EntryPage";
const axios = require("axios");
const jsonfile = require("jsonfile");
const FormData = require("form-data");
const path = require("path");
const fs = require("fs");

interface ExtensionUid {
  uid: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const { STACK_API_KEY, ORG_ID, APP_BASE_URL, EMAIL, PASSWORD, DEVELOPER_HUB_API, BASE_API_URL }: any = process.env;

const file = "data.json";

const savedObj: Record<string, string> = {};

// initialize entry class
export const initializeEntry = async (page: Page) => {
  return new EntryPage(page);
};

// entry page access
export const entryPageFlow = async (
  savedCredentials: { contentTypeId: string; entryUid: string },
  entryPage: EntryPage
) => {
  //navigate to stacks page
  const { contentTypeId, entryUid } = savedCredentials;
  await entryPage.navigateToEntry(STACK_API_KEY, contentTypeId, entryUid);
};

const writeFile = async (obj: Record<string, string>) => {
  jsonfile
    .writeFile(file, obj)
    .then((res: unknown) => {
      return res;
    })
    .catch((error: unknown) => console.error(error));
};

// Upload an asset to the stack
export const assetUpload = async (stackApiKey: string | undefined, authToken: string) => {
  const assetPath = await path.resolve(__dirname, "../../public/logo192.png");
  const readFile = await fs.createReadStream(assetPath);
  const form = new FormData();
  form.append("asset[upload]", readFile, "test-asset");
  const options = {
    headers: {
      "Content-Type": "multipart/form-data",
      api_key: stackApiKey,
      authtoken: authToken,
      ...form.getHeaders(),
    },
    data: form,
  };
  try {
    return await axios.post(`https://${BASE_API_URL}/v3/assets`, form, options);
  } catch (error) {
    console.error(error);
  }
};

export const deleteAsset = async (authToken: string, assetUid: string) => {
  const options = {
    url: `https://${BASE_API_URL}/v3/assets/${assetUid}`,
    method: "DELETE",
    headers: {
      api_key: STACK_API_KEY,
      authtoken: authToken,
      "Content-type": "application/json",
    },
  };
  try {
    return await axios(options);
  } catch (error) {
    console.error(error);
  }
};

// get authtoken
export const getAuthToken = async () => {
  const options = {
    url: `https://${BASE_API_URL}/v3/user-session`,
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    data: {
      user: {
        email: EMAIL,
        password: PASSWORD,
      },
    },
  };
  try {
    const result = await axios(options);
    savedObj["authToken"] = result.data.user.authtoken;
    await writeFile(savedObj);
    return result.data.user.authtoken;
  } catch (error) {
    console.error(error);
  }
};

interface AppData {
  appId: string;
  appName: string;
}

// create app in developer hub
export const createApp = async (authToken: string, randomTestNumber: number): Promise<AppData> => {
  const options = {
    url: `https://${DEVELOPER_HUB_API}/apps`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      organization_uid: ORG_ID,
      authtoken: authToken,
    },
    data: {
      name: `Color Picker E2E ${randomTestNumber}`,
      target_type: "stack",
      ui_location: {
        locations: [
          {
            type: "cs.cm.stack.custom_field",
            meta: [
              {
                path: "/custom-field",
                signed: false,
                enabled: true,
                data_type: "json",
              },
            ],
          },
        ],
        signed: true,
        base_url: APP_BASE_URL,
      },
      hosting: {
        provider: "external",
        deployment_url: APP_BASE_URL,
      },
    },
  };
  const result = await axios(options);
  return { appId: result.data.data.uid, appName: options.data.name };
};

// get installed app
export const getInstalledApp = async (authToken: string, appId: string) => {
  const options = {
    url: `https://${DEVELOPER_HUB_API}/apps/${appId}/installations`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      organization_uid: ORG_ID,
      authtoken: authToken,
    },
  };
  try {
    const result = await axios(options);
    return result.data;
  } catch (error) {
    return error;
  }
};

// install app in stack & return installation id
export const installApp = async (authToken: string, appId: string, stackApiKey: string | undefined) => {
  const options = {
    url: `https://${DEVELOPER_HUB_API}/apps/${appId}/install`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      organization_uid: ORG_ID,
      authtoken: authToken,
    },
    data: {
      target_type: "stack",
      target_uid: stackApiKey,
    },
  };
  try {
    const result = await axios(options);
    return result.data.data.installation_uid;
  } catch (error) {
    return error;
  }
};

// uninstall app from the stack
export const uninstallApp = async (authToken: string, installId: string) => {
  const options = {
    url: `https://${DEVELOPER_HUB_API}/installations/${installId}`,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      organization_uid: ORG_ID,
      authtoken: authToken,
    },
  };
  try {
    const result = await axios(options);
    return result.data;
  } catch (error) {
    return error;
  }
};

// deletes the created test app during tear down
export const deleteApp = async (token: string, appId: string) => {
  const options = {
    url: `https://${DEVELOPER_HUB_API}/apps/${appId}`,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      organization_uid: ORG_ID,
      authtoken: token,
    },
  };
  try {
    await axios(options);
  } catch (error) {
    return error;
  }
};

// create content-type
export const createContentType = async (authToken: string, appName: string, extension_uid: ExtensionUid[]) => {
  const options = {
    url: `https://${BASE_API_URL}/v3/content_types`,
    method: "POST",
    headers: {
      api_key: STACK_API_KEY,
      authtoken: authToken,
      "Content-type": "application/json",
    },
    data: {
      content_type: {
        title: appName,
        uid: appName.replace(/\s/g, "_").toLowerCase(),
        schema: [
          {
            display_name: "Title",
            uid: "title",
            data_type: "text",
            field_metadata: {
              _default: true,
            },
            unique: false,
            mandatory: true,
            multiple: false,
          },
          {
            display_name: "URL",
            uid: "url",
            data_type: "text",
            field_metadata: {
              _default: true,
            },
            unique: false,
            multiple: false,
          },
          {
            display_name: appName,
            uid: "text",
            data_type: "json",
            extension_uid: extension_uid,
            config: {},
            mandatory: true,
            field_metadata: {
              extension: true,
            },
            multiple: false,
            unique: false,
          },
        ],
      },
    },
  };
  try {
    const result = await axios(options);
    return result.data;
  } catch (error) {
    return error;
  }
};

// create entry
export const createEntry = async (authToken: string, appName: string, contentTypeId: string) => {
  const generateTitle = `${appName} : Entry`;
  const options = {
    url: `https://${BASE_API_URL}/v3/content_types/${contentTypeId}/entries`,
    params: { locale: "en-us" },
    method: "POST",
    headers: {
      api_key: STACK_API_KEY,
      authtoken: authToken,
      "Content-type": "application/json",
    },
    data: {
      entry: {
        title: generateTitle,
        showPicker: true,
        pickerColor: {
          r: "108",
          g: "92",
          b: "231",
          a: "100",
        },
      },
    },
  };
  try {
    const result = await axios(options);
    return result.data;
  } catch (error) {
    return error;
  }
};

// deletes the created content type during tear down
export const deleteContentType = async (token: string, contentTypeId: string) => {
  const options = {
    url: `https://${BASE_API_URL}/v3/content_types/${contentTypeId}`,
    method: "DELETE",
    headers: {
      api_key: STACK_API_KEY,
      authtoken: token,
      "Content-type": "application/json",
    },
  };
  try {
    await axios(options);
  } catch (error) {
    return error;
  }
};

// get list of apps/extension IDs
export const getExtensionFieldUid = async (authToken: string, appName: string) => {
  const options = {
    url: `https://${BASE_API_URL}/v3/extensions`,
    method: "GET",
    params: {
      query: {
        type: "field",
      },
      include_marketplace_extensions: true,
    },
    headers: {
      api_key: STACK_API_KEY,
      authtoken: authToken,
    },
  };
  const result = await axios(options);
  return result.data.extensions.find((extension: { title: string; uid: string }) => extension.title === appName)?.uid;
};
/* eslint-enable @typescript-eslint/no-explicit-any */
