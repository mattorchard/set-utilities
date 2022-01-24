import { useCallback, useEffect, useMemo, useState } from "react";
import { BundleRepository } from "../helpers/BundleRepository";
import { debounce } from "../helpers/timingHelpers";

const emptyBundle: Bundle = {
  sources: [],
  replacements: [],
  options: {
    operation: "intersection",
    ignoreWhitespace: true,
    ignoreCase: true,
    filter: null,
    delimiter: "\\n",
    minLength: 1,
  },
};

const saveBundleDebounced = debounce(BundleRepository.saveLastBundle, 500);

export const useBundle = () => {
  const [bundle, setBundle] = useState<Bundle>(emptyBundle);
  const [lastBundle, setLastBundle] = useState<Bundle | null>(null);
  const isSaveInPlaceEnabled = useMemo(
    () => bundle.sources.every((bundle) => bundle.handle),
    [bundle.sources]
  );

  useEffect(() => {
    BundleRepository.getLastBundle().then(setLastBundle);
  }, []);

  const dismissLastBundle = useCallback(() => {
    setLastBundle(null);
  }, []);

  const restoreLastBundle = useCallback(() => {
    console.debug("Restoring bundle", lastBundle);
    setBundle((b) => lastBundle ?? b);
    dismissLastBundle();
  }, [lastBundle, dismissLastBundle]);

  useEffect(() => {
    if (bundle.sources.length === 0) return;
    saveBundleDebounced(bundle);
    dismissLastBundle();
  }, [dismissLastBundle, bundle]);

  const actions = useMemo(
    () => ({
      addReplacement: (replacement: RunReplacement) =>
        setBundle((b) => ({
          ...b,
          replacements: [replacement, ...b.replacements],
        })),
      setOptions: (options: Partial<RunOptions>) =>
        setBundle((b) => ({ ...b, options: { ...b.options, ...options } })),
      addSources: (sources: RunSource[]) =>
        setBundle((b) => ({ ...b, sources: [...sources, ...b.sources] })),
      removeSource: (idToRemove: string) =>
        setBundle((b) => ({
          ...b,
          sources: b.sources.filter((source) => source.id !== idToRemove),
        })),
      editSource: (change: RunSourceChange) =>
        setBundle((b) => ({
          ...b,
          sources: b.sources.map((source) =>
            source.id === change.id ? { ...source, ...change } : source
          ),
        })),
      setReplacements: (replacements: RunReplacement[]) =>
        setBundle((b) => ({ ...b, replacements })),
    }),
    []
  );
  return {
    ...bundle,
    ...actions,
    isSaveInPlaceEnabled,
    isRestoreEnabled: !!lastBundle,
    restoreLastBundle,
    dismissLastBundle,
  };
};
