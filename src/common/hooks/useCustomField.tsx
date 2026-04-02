import { useContext } from "react";
import { CustomFieldExtensionContext } from "../contexts/customFieldExtensionContext";

/**
 * Getter and setter hook for custom field data
 * @returns tuple [customField, setFieldData, loading]
 *
 * Eg:
 * const [customField, setFieldData, loading] = useCustomField();
 */
export const useCustomField = (): [unknown, (data: unknown) => Promise<void>, boolean] => {
  const { customField, setFieldData, loading } = useContext(CustomFieldExtensionContext);
  return [customField, setFieldData, loading];
};
