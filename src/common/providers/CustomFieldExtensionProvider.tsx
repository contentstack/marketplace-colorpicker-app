import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useAppLocation } from "../hooks/useAppLocation";
import { isEmpty } from "lodash";
import { CustomFieldExtensionContext } from "../contexts/customFieldExtensionContext";
import type { CustomFieldLocation } from "../types/customFieldSdk";

export const CustomFieldExtensionProvider = ({ children }: { children: ReactNode }) => {
  const [customField, setCustomField] = useState<unknown>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { location: locationUnknown } = useAppLocation();
  const location = locationUnknown as CustomFieldLocation;

  useEffect(() => {
    (async () => {
      // check if the data was loaded earlier or not
      if (isEmpty(customField)) {
        setLoading(true);
        const fieldData = await location.field.getData();
        setCustomField(fieldData);
        setLoading(false);
      }
    })();
  }, [setLoading, setCustomField, location, customField]);

  const setFieldData = useCallback(
    async (data: unknown) => {
      setLoading(true);
      await location.field.setData(data);
      setCustomField(data);
      setLoading(false);
    },
    [location, setLoading, setCustomField]
  );

  return (
    <CustomFieldExtensionContext.Provider value={{ customField, setFieldData, loading }}>
      {children}
    </CustomFieldExtensionContext.Provider>
  );
};
