const axios = require('axios');
const jsonfile = require('jsonfile');

interface ExtensionUid {
  uid: string;
}

const file = 'data.json';

const savedObj = {};

const writeFile = async (obj: any) => {
    jsonfile
      .writeFile(file, obj)
      .then((res) => {
        return res;
      })
      .catch((error) => console.error(error));
  };

export const getAuthToken = async (): Promise<string> => {
    let options = {
      url: `https://${process.env.BASE_API_URL}/v3/user-session`,
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      data: {
        user: {
          email: process.env.CONTENTSTACK_LOGIN,
          password: process.env.CONTENTSTACK_PASSWORD,
        },
      },
    };
    try {
      const result = await axios(options);
      savedObj['authToken'] = result.data.user.authtoken;
      await writeFile(savedObj);
      return result.data.user.authtoken;
    } catch (error) {
      return error;
    }
  };