import { asDocument } from "./setUtils";

describe("as document", () => {
  it("multi-line-case", () => {
    const actual = asDocument(
      { id: "a", content: "a\n\n b \nc", type: "raw", name: "Test" },
      {
        delimiter: "\\r?\\n\\r?\\n",
        minLength: 1,
        operation: "intersection",
        filter: null,
        ignoreCase: true,
        ignoreWhitespace: true,
      }
    );
    expect(actual.segments).toStrictEqual([
      {
        original: "a",
        clean: "a",
        lineStart: 1,
        lineEnd: 1,
      },
      {
        clean: "bc",
        original: " b \nc",
        lineStart: 3,
        lineEnd: 4,
      },
    ]);
  });
});
