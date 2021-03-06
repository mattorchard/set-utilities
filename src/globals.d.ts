declare global {
  type RunOperation = "intersection" | "unique" | "common";

  interface RunOptions {
    operation: RunOperation;
    ignoreWhitespace: boolean;
    ignoreCase: boolean;
    filter: string | null;
    delimiter: string;
    minLength: number;
  }

  interface RunSource {
    id: string;
    type: "raw" | "file";
    name: string;
    content: string;
    handle?: FileSystemFileHandle;
  }

  type RunSourceChange = Partial<RunSource> & Pick<RunSource, "id">;

  interface RunDocumentSegment {
    lineStart: number;
    lineEnd: number;
    original: string;
    clean: string;
  }
  interface RunSourceDocument extends RunSource {
    segments: RunDocumentSegment[];
  }

  interface RunResult {
    id: string;
    doc: RunSourceDocument;
    segments: RunDocumentSegment[];
    preview: string;
  }
  interface RunReportItem {
    id: string;
    combinedDocId: string;
    docs: RunSourceDocument[];
    results: RunResult[][];
  }

  interface OutputViewOptions {
    isHeadingEnabled: boolean;
    isLineNumberEnabled: boolean;
  }

  interface RunReplacement {
    id: string;
    docs: RunSourceDocument[];
    results: RunResult[];
    replacement: string;
  }
  interface Bundle {
    sources: RunSource[];
    options: RunOptions;
    replacements: RunReplacement[];
  }
}

export {};
