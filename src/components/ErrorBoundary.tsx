import React from "react";
import PropTypes from "prop-types";
import { datadogRum } from "@datadog/browser-rum";

const ENV: string = import.meta.env.MODE;

datadogRum.init({
  applicationId: import.meta.env.VITE_DATADOG_RUM_APPLICATION_ID as string,
  clientToken: import.meta.env.VITE_DATADOG_RUM_CLIENT_TOKEN as string,
  site: import.meta.env.VITE_DATADOG_RUM_SITE as string,
  service: import.meta.env.VITE_DATADOG_RUM_SERVICE as string,
  // env: import.meta.env.VITE_DATADOG_RUM_ENV as string,
  // Specify a version number to identify the deployed version of your application in Datadog
  version: "1.1.0",
  sessionSampleRate: 100,
  sessionReplaySampleRate: 20,
  trackUserInteractions: true,
  trackResources: true,
  trackLongTasks: true,
  defaultPrivacyLevel: "mask-user-input",
});

// sending MetaData to Datadog RUM
datadogRum.setGlobalContextProperty("Application Type", "Marketplace");
datadogRum.setGlobalContextProperty("Application Name", "Color Picker App");

/**
 * Global Error Boundary component
 * Errors are logged on to TrackJS service
 */
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  static propTypes = {
    children: PropTypes.node,
  };
  state: { hasError: boolean };

  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    // You can also log the error to an error reporting service
    if (ENV === "development") {
      console.error(error);
      return;
    }
    datadogRum.addError(error);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
