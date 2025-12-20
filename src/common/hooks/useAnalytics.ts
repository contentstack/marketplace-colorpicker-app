import { useCallback } from "react";
import { useAppSdk } from "./useAppSdk";

const ENV: string = import.meta.env.MODE;

/**
 * Initialise Heap
 */

type AnalyticsApi = { trackEvent: (event: string, eventData?: { [key: string]: string }) => void };

/**
 * useAnalytics hook to track user actions and events in application
 */
export const useAnalytics = (): AnalyticsApi => {
  const appSDK = useAppSdk();
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
