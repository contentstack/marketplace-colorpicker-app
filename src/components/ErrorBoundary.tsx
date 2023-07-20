import React from "react";
import { datadogRum } from "@datadog/browser-rum";

const ENV: string = process.env.NODE_ENV;

datadogRum.init({
  applicationId: `${process.env.REACT_APP_DATADOG_RUM_APPLICATION_ID}`,
  clientToken: `${process.env.REACT_APP_DATADOG_RUM_CLIENT_TOKEN}`,
  site: `${process.env.REACT_APP_DATADOG_RUM_SITE}`,
  service: `${process.env.REACT_APP_DATADOG_RUM_SERVICE}`,
  env: `${process.env.REACT_APP_DATADOG_RUM_ENV}`,
  // Specify a version number to identify the deployed version of your application in Datadog
  // version: '1.0.0',
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
export class ErrorBoundary extends React.Component {
  state: { hasError: boolean };

  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
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

    // @ts-ignore
    return this.props.children;
  }
}
