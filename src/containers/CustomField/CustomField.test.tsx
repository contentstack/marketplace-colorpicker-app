import type { ReactNode } from "react";
import type Extension from "@contentstack/app-sdk/dist/src/extension";
import { render, screen } from "@testing-library/react";
import CustomFieldExtension from "./CustomField";
import { CustomFieldTestProvider, TestProvider } from "../../test-utils/test-utils";

xtest("CustomFieldExtension component", async () => {
  const appSdkMock = {
    location: {
      CustomField: {
        field: {
          setData: jest.fn(),
          getData: async () => "HELLO",
        },
      },
    },
  };

  const customField = {
    customField: "HELLO",
    setFieldData: jest.fn(async () => {}),
    loading: false,
  };

  render(<CustomFieldExtension />, {
    wrapper: ({ children }: { children: ReactNode }) => (
      <TestProvider appConfig={{}} appSdk={appSdkMock as unknown as Extension}>
        <CustomFieldTestProvider
          customField={customField.customField}
          setFieldData={customField.setFieldData}
          loading={customField.loading}>
          {children}
        </CustomFieldTestProvider>
      </TestProvider>
    ),
  });

  expect(screen.getByText(/Custom Field/)).toBeInTheDocument();
});
