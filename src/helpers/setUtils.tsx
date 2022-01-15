import { createId } from "./idHelpers";

const isOnlyWhitespace = (text: string) => !text || /^\s+$/.test(text);

const cleanLine = (original: string, options: RunOptions): string => {
  let clean = original.trim();
  if (options.ignoreCase) {
    clean = clean.toLowerCase();
  }
  if (options.ignoreWhitespace) {
    clean = clean.replaceAll(/\s+/g, "");
  }
  return clean;
};

const asDocument = (
  source: RunSource,
  options: RunOptions
): RunSourceDocument => {
  const originals = source.content.split(
    new RegExp(options.delimiter || "\r?\n")
  );
  return {
    ...source,
    lines: originals.map((original, index) => ({
      original,
      index,
      clean: cleanLine(original, options),
    })),
  };
};

const applyOperationToDocuments = (
  docs: RunSourceDocument[],
  isDesiredCount: (count: number) => any,
  minLength: number
) => {
  const linesSeenInMap = new Map<string, Map<string, RunResult>>();
  docs.forEach((doc) =>
    doc.lines.forEach((line) => {
      if (line.clean.length < minLength) return;
      if (isOnlyWhitespace(line.clean)) return;
      const docsLineSeenIn =
        linesSeenInMap.get(line.clean) ?? new Map<string, RunResult>();
      const intermediateMatch = docsLineSeenIn.get(doc.id) ?? {
        doc,
        lines: [],
        id: createId(),
      };
      intermediateMatch.lines.push(line);
      docsLineSeenIn.set(doc.id, intermediateMatch);
      linesSeenInMap.set(line.clean, docsLineSeenIn);
    })
  );

  const results: RunResult[][] = [];
  for (const docsLineSeenIn of linesSeenInMap.values()) {
    if (!isDesiredCount(docsLineSeenIn.size)) continue;
    results.push([...docsLineSeenIn.values()]);
  }
  return results;
};

export const applyOperationToSources = (
  sources: RunSource[],
  options: RunOptions
) => {
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
