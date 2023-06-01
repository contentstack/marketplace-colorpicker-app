// module dependencies
const axios = require("axios");

// deletes the created test app during tear down
export const deleteApp = async (token, appId) => {
  let options = {
    url: `https://${process.env.DEVELOPER_HUB_API}/apps/${appId}`,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      organization_uid: process.env.ORG_ID,
      authtoken: token,
    },
  };
  try {
    let result = await axios(options);
    return result.data;
  } catch (error) {
    return error;
  }
};
// deletes the created content type during tear down
export const deleteContentType = async (
  authToken: string | undefined,
  stackApiKey: string | undefined,
  mgmtToken: string | undefined,
  contentTypeID: string | undefined
) => {
  let options = {
    url: `https://${process.env.BASE_API_URL}/v3/content_types/${contentTypeID}?`,
    method: "DELETE",
    headers: {
      api_key: stackApiKey,
      authtoken: authToken,
      authorization: mgmtToken,
    },
  };
  try {
    let result = await axios(options);
    return result.data;
  } catch (error) {
    return error;
  }
};
//deletes release
export const deleteRelease = async (
  authToken: string | undefined,
  stackApiKey: string | undefined,
  mgmtToken: string | undefined,
  releaseID: string | undefined
) => {
  let options = {
    url: `https://${process.env.BASE_API_URL}/v3/releases/${releaseID}`,
    method: "DELETE",
    headers: {
      api_key: stackApiKey,
      authtoken: authToken,
      authorization: mgmtToken,
      "Content-type": "application/json",
    },
  };
  try {
    let result = await axios(options);
    return result.data;
  } catch (error) {
    return error;
  }
};