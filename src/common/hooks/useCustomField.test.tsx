import type { ReactNode } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { CustomFieldTestProvider } from "../../test-utils/test-utils";
import { useCustomField } from "./useCustomField";

describe("useCustomField", () => {
  const customField = {
    customField: "Hello",
    setFieldData: jest.fn(async () => {}),
    loading: false,
  };

  xit("should return the value from app SDK", async function () {
    const { result } = renderHook(() => useCustomField(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <CustomFieldTestProvider
          customField={customField.customField}
          setFieldData={customField.setFieldData}
          loading={customField.loading}>
          {children}
        </CustomFieldTestProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current[0]).toBe("Hello");
    });
  });
});
