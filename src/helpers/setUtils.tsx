import { createId } from "./idHelpers";
import { getCount, splitFilter } from "./arrayHelpers";

const isOnlyWhitespace = (text: string) => !text || /^\s+$/.test(text);

const cleanLine = (original: string, options: RunOptions): string => {
  let clean = original.trim();
  if (options.ignoreCase) {
    clean = clean.toLowerCase();
  }
  if (options.ignoreWhitespace) {
    clean = clean.replace(/\s+/g, "");
  }
  return clean;
};

const parenthesize = (text: string) => `(${text})`;

const getLineCount = (text: string) =>
  getCount([...text], (char) => char === "\n");

const getOptionRegexes = (options: RunOptions) => {
  const flags = options.ignoreCase ? "i" : "";
  const delimiter = options.delimiter || "\\n";
  const filter = options.filter || "";
  return {
    delimiter: new RegExp(delimiter, flags),
    split: new RegExp(parenthesize(delimiter), flags),
    filter: new RegExp(filter, flags),
  };
};

export const asDocument = (
  source: RunSource,
  options: RunOptions
): RunSourceDocument => {
  const regexes = getOptionRegexes(options);
  const originals = source.content.split(regexes.split);
  const segments: RunDocumentSegment[] = [];

  let lineNo = 1;
  for (const original of originals) {
    const lineStart = lineNo;
    lineNo += getLineCount(original);
    const lineEnd = lineNo;

    if (!regexes.delimiter.test(original) && regexes.filter.test(original))
      segments.push({
        lineStart,
        lineEnd,
        original,
        clean: cleanLine(original, options),
      });
  }
  return { ...source, segments };
};

const combineIds = (docIds: string[]) => docIds.sort().join("_");

const applyOperationToDocuments = (
  docs: RunSourceDocument[],
  isDesiredCount: (count: number) => any,
  minLength: number
) => {
  const segmentsSeenInMap = new Map<string, Map<string, RunResult>>();
  docs.forEach((doc) =>
    doc.segments.forEach((segment) => {
      if (segment.clean.length < minLength) return;
      if (isOnlyWhitespace(segment.clean)) return;
      const docsLineSeenIn =
        segmentsSeenInMap.get(segment.clean) ?? new Map<string, RunResult>();
      const intermediateMatch = docsLineSeenIn.get(doc.id) ?? {
        doc,
        segments: [],
        id: createId(),
        preview: segment.original,
      };
      intermediateMatch.segments.push(segment);
      docsLineSeenIn.set(doc.id, intermediateMatch);
      segmentsSeenInMap.set(segment.clean, docsLineSeenIn);
    })
  );

  const results = new Map<string, RunReportItem>();

  for (const docsLineSeenIn of segmentsSeenInMap.values()) {
    if (!isDesiredCount(docsLineSeenIn.size)) continue;

    const runResults = [...docsLineSeenIn.values()];
    const docIds = runResults.map((result) => result.doc.id);
    const combinedDocId = combineIds(docIds);

    const reportItem = results.get(combinedDocId) ?? {
      id: createId(),
      combinedDocId,
      results: [],
      docs: runResults.map((r) => r.doc),
    };
    reportItem.results.push(runResults);
    results.set(combinedDocId, reportItem);
  }
  return [...results.values()].sort((a, b) => b.docs.length - a.docs.length);
};

export const applyOperationToSources = (
  sources: RunSource[],
  options: RunOptions
): RunReportItem[] => {
  if (sources.length < 2) throw new Error(`Must have at least two sources`);
  const sourceDocuments = sources.map((source) => asDocument(source, options));
  switch (options.operation) {
    case "unique":
      return applyOperationToDocuments(
        sourceDocuments,
        (count) => count === 1,
        options.minLength
      );
    case "common":
      return applyOperationToDocuments(
        sourceDocuments,
        (count) => count >= 2,
        options.minLength
      );
    case "intersection":
      return applyOperationToDocuments(
        sourceDocuments,
        (count) => count === sources.length,
        options.minLength
      );
  }
};

const applyReplacementsToSource = (
  source: RunSource,
  options: RunOptions,
  replacementMap: Map<string, string>
) => {
  const regexes = getOptionRegexes(options);
  const contentChunks = source.content.split(regexes.split).map((original) => {
    if (regexes.delimiter.test(original)) {
      return original;
    }
    const clean = cleanLine(original, options);
    return replacementMap.get(clean) ?? original;
  });

  return {
    ...source,
    content: contentChunks.join(""),
  };
};

export const applyReplacements = (
  sources: RunSource[],
  options: RunOptions,
  replacements: RunReplacement[],
  includeUnmodifiedFiles: boolean
) => {
  const modifiedDocIds = new Set(
    replacements.flatMap((replacement) => replacement.docs.map((doc) => doc.id))
  );

  const { true: sourcesToModify, false: unmodifiedSources } = splitFilter(
    sources,
    (source) => modifiedDocIds.has(source.id)
  );
  const replacementMap = new Map(
    replacements.map((r) => [r.results[0].segments[0].clean, r.replacement])
  );
  const modifiedSources = sourcesToModify.map((source) =>
    applyReplacementsToSource(source, options, replacementMap)
  );

  return includeUnmodifiedFiles
    ? [...modifiedSources, ...unmodifiedSources]
    : modifiedSources;
};
