import { openDB, DBSchema } from "idb";

interface BundleRepositorySchema extends DBSchema {
  bundles: {
    key: string;
    value: Bundle;
  };
}
const dbPromise = openDB<BundleRepositorySchema>("BUNDLE_REPO", 1, {
  upgrade(db) {
    db.createObjectStore("bundles");
  },
});

const LAST_BUNDLE_KEY = "LAST_BUNDLE_KEY_V1";

const getLastBundle = async () => {
  const db = await dbPromise;
  return (await db.get("bundles", LAST_BUNDLE_KEY)) ?? null;
};

const saveLastBundle = async (bundle: Bundle) => {
  const db = await dbPromise;
  console.debug("Saving bundle", bundle);
  return await db.put("bundles", bundle, LAST_BUNDLE_KEY);
};

export const BundleRepository = {
  getLastBundle,
  saveLastBundle,
};
