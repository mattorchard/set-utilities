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
  }
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
    doc: RunSourceDocument;
    segments: RunDocumentSegment[];
    id: string;
  }
  interface RunReportItem {
    id: string;
    combinedDocId: string;
    docs: RunSourceDocument[];
    results: RunResult[][];
  }
}

export {};
