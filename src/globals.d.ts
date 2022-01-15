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
}

export {};
