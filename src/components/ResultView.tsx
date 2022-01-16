import React from "react";
import Typo from "./Typo";
import "./ResultView.css";

interface ResultViewProps {
  report: RunReportItem[];
  isNamesEnabled: boolean;
}

const ResultView: React.FC<ResultViewProps> = ({ report, isNamesEnabled }) => (
  <ol>
    {report.map((reportItem) => (
      <li key={reportItem.id}>
        {isNamesEnabled &&
          `In docs (${reportItem.docs.map((r) => r.name).join(", ")})`}
        {reportItem.results.map((results, index) => (
          <Typo key={index} monospace className="result__preview">
            {results[0].lines[0].original}
          </Typo>
        ))}
      </li>
    ))}
  </ol>
);

export default ResultView;
