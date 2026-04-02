/** Narrow subset of App SDK `location` used by the custom field extension */
export type CustomFieldLocation = {
  field: {
    getData: () => Promise<unknown>;
    setData: (data: unknown) => Promise<void>;
  };
};
