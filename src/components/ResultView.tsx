import React from "react";

interface ResultViewProps {
  result: RunResult[][];
}

const ResultView: React.FC<ResultViewProps> = ({ result }) => (
  <ol>
    {result.map((result, index) => (
      <li key={index}>
        {result[0].lines[0].original}
        In docs ({result.map((r) => r.doc.name).join(", ")})
      </li>
    ))}
  </ol>
);

export default ResultView;
