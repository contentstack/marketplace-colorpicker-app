import type { ReactElement, ReactNode } from "react";
import React from "react";
import type Extension from "@contentstack/app-sdk/dist/src/extension";
import { render } from "@testing-library/react";
import { MarketplaceAppContext } from "../common/contexts/marketplaceContext";
import { CustomFieldExtensionContext } from "../common/contexts/customFieldExtensionContext";
import type { KeyValueObj } from "../common/types/types";

export const TestProvider = ({
  children,
  appSdk,
  appConfig = {} as KeyValueObj,
}: {
  appConfig?: KeyValueObj;
  children?: ReactNode;
  appSdk: Extension | null;
}) => {
  return (
    <MarketplaceAppContext.Provider value={{ appSdk, appConfig: appConfig ?? null }}>
      {children}
    </MarketplaceAppContext.Provider>
  );
};

export const CustomFieldTestProvider = ({
  children,
  customField,
  loading = false,
  setFieldData,
}: {
  customField: unknown;
  children?: ReactNode;
  loading: boolean;
  setFieldData: (data: unknown) => Promise<void>;
}) => {
  return (
    <CustomFieldExtensionContext.Provider value={{ customField, loading, setFieldData }}>
      {children}
    </CustomFieldExtensionContext.Provider>
  );
};

const AllTheProviders = ({
  children,
  initialProps,
}: {
  children?: ReactNode;
  initialProps?: { appConfig?: KeyValueObj; appSdk?: Extension | null };
}) => {
  return (
    <TestProvider appConfig={initialProps?.appConfig ?? {}} appSdk={initialProps?.appSdk ?? null}>
      {children}
    </TestProvider>
  );
};

const customRender = (ui: ReactElement, options?: object) => render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
