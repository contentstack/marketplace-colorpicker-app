import type { ReactNode } from "react";
import type Extension from "@contentstack/app-sdk/dist/src/extension";
import { renderHook } from "@testing-library/react";
import { TestProvider } from "../../test-utils/test-utils";
import { useAppSdk } from "./useAppSdk";

test("useAppSdk", async () => {
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
  const { result } = renderHook(() => useAppSdk(), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <TestProvider appConfig={{}} appSdk={appSdkMock as unknown as Extension}>
        {children}
      </TestProvider>
    ),
  });

  expect(result.current).toBe(appSdkMock);
});
