import React from "react";
import { datadogRum } from '@datadog/browser-rum';

interface MyProps {
	children: React.ReactElement;
}

interface MyState {
	hasError: boolean;
}


//datadog-rum Installation
datadogRum.init({
	applicationId: `${process.env.REACT_APP_DATADOG_RUM_APPLICATION_ID}`,
	clientToken: `${process.env.REACT_APP_DATADOG_RUM_CLIENT_TOKEN}`,
	site: `${process.env.REACT_APP_DATADOG_RUM_SITE}`,
	service: `${process.env.REACT_APP_DATADOG_RUM_SERVICE}`,
	sampleRate: 100,
	sessionReplaySampleRate: 20,
	trackInteractions: true,
	trackResources: true,
	trackLongTasks: true,
	defaultPrivacyLevel: 'mask-user-input',
	useCrossSiteSessionCookie: true,
  });
  
  //sending MetaData to Datadog RUM
  datadogRum.setGlobalContextProperty('Application Type', 'Marketplace');
  datadogRum.setGlobalContextProperty('Application Name', 'JSON Editor App');

class ErrorBoundary extends React.Component<MyProps, MyState> {
	constructor(props: any) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: any) {
		// Update state so the next render will show the fallback UI.
		console.warn(error); // Remove this line if not required.
		return { hasError: true };
	}

	componentDidCatch(error: any, errorInfo: any) {
		// You can also log the error to an error reporting service
		// logErrorToMyService(error, errorInfo);
		console.error("errorInfo ", errorInfo);
		throw new Error(errorInfo);
	}

	render() {
		const { hasError } = this.state;
		const { children } = this.props;
		if (hasError) {
			// You can render any custom fallback UI
			return <h1>Something went wrong.</h1>;
		}

		return children;
	}
}

export default ErrorBoundary;
