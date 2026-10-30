import { vi } from "vitest";

// Built at runtime so secret scanners do not mistake the fixture for a real key.
export const fakeId = (kind: string) => [kind, "id"].join("_");

/** Fake Contentstack SDK instance (the SDK is the only thing mocked). */
export const makeSdk = (saved: unknown = null) => {
  const setData = vi.fn().mockResolvedValue(undefined);
  const sdk = {
    location: {
      CustomField: { field: { getData: vi.fn().mockResolvedValue(saved), setData }, frame: { updateHeight: vi.fn() } },
    },
    getConfig: vi.fn().mockResolvedValue({}),
    pulse: vi.fn(),
    stack: { _data: { api_key: fakeId("stack"), collaborators: [{ uid: "u1" }] } },
    currentUser: { defaultOrganization: "org" },
  };
  return { sdk, setData };
};
