import { useAppSdk } from "./useAppSdk";
import { useCallback } from "react";

const ENV: string = process.env.NODE_ENV;

type AnalyticsApi = { trackEvent: Function };

export const useAnalytics = (): AnalyticsApi => {
  const [appSDK] = useAppSdk();
  const trackEvent = useCallback(
    (event: string, eventData: { [key: string]: string } = {}) => {
      // skip tracking if env is development
      if (ENV === "production") {
        appSDK?.pulse(event, eventData);
      }
    },
    [appSDK]
  );

  return { trackEvent };
};

export default useAnalytics;
