declare global {
  type RunOperation = "intersection" | "unique" | "common";

  interface RunOptions {
    operation: RunOperation;
    ignoreWhitespace: boolean;
    ignoreCase: boolean;
    delimiter: string;
    minLength: number;
  }

  interface RunSource {
    id: string;
    type: "raw" | "file";
    name: string;
    content: string;
  }
  type RunDocumentLine = {
    index: number;
    original: string;
    clean: string;
  };
  interface RunSourceDocument extends RunSource {
    lines: RunDocumentLine[];
  }

  interface RunResult {
    doc: RunSourceDocument;
    lines: RunDocumentLine[];
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
