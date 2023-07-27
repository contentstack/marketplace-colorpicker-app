import ContentstackAppSDK from "@contentstack/app-sdk";
import Extension from "@contentstack/app-sdk/dist/src/extension";
import { get, isNull } from "lodash";
import React, { useEffect, useState } from "react";
import { AppFailed } from "../../components/AppFailed";
import { MarketplaceAppContext } from "../contexts/marketplaceContext";
import { useJSErrorTracking } from "../hooks/useJSErrorTracking";
import { KeyValueObj } from "../types/types";
import { getAppLocation } from "../utils/functions";
import { eventNames } from "../../constants";

type ProviderProps = {
  children?: React.ReactNode;
};

/**
 * Marketplace App Provider
 * @param children: React.ReactNode
 */
export const MarketplaceAppProvider: React.FC<ProviderProps> = ({ children }) => {
  const [failed, setFailed] = useState<boolean>(false);
  const [appSdk, setAppSdk] = useState<Extension | null>(null);
  const [appConfig, setConfig] = useState<KeyValueObj | null>(null);
  const { setErrorsMetaData, trackError } = useJSErrorTracking();
  const ENV: string = process.env.NODE_ENV;

  // Initialize the SDK and track analytics event
  useEffect(() => {
    ContentstackAppSDK.init()
      .then(async (appSdk) => {
        setAppSdk(appSdk);
        const appConfig = await appSdk.getConfig();
        setConfig(appConfig);
        appSdk.location.CustomField?.frame?.updateHeight?.(350);
        const appLocation: string = getAppLocation(appSdk);
        let properties = {
          Stack: appSdk?.stack._data.api_key,
          Organization: appSdk?.currentUser.defaultOrganization,
          "App Location": appLocation,
          "User Id": get(appSdk, "stack._data.collaborators.0.uid", ""), //first uuid from collaborators
        };
        setErrorsMetaData(properties); // set global event data for errors
        // skip tracking if env is development
        if (ENV === "production") {
          appSdk.pulse(eventNames.APP_INITIALIZE_SUCCESS, properties);
        }
      })
      .catch((err: Error) => {
        setFailed(true);
        trackError(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // wait until the SDK is initialized. This will ensure the values are set
  // correctly for appSdk.
  if (!failed && isNull(appSdk)) {
    return <div>Loading...</div>;
  }

  if (failed) {
    return <AppFailed />;
  }

  return <MarketplaceAppContext.Provider value={{ appSdk, appConfig }}>{children}</MarketplaceAppContext.Provider>;
};
