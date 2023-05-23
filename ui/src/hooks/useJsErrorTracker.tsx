import { datadogRum } from '@datadog/browser-rum';

const useJsErrorTracker = () => {
  const addMetadata = (key: string, value: string) => {
    datadogRum.setGlobalContextProperty(key, value);   
  };
  const trackError = (error: any) => {
    //error tracking by dataDog RUM
    datadogRum.addError(error);
  };
  return { addMetadata, trackError };
};

export default useJsErrorTracker;