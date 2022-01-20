import React from "react";
import Typo from "./Typo";
import "./ResultView.css";
import Box from "./Box";
import { Tooltip } from "@blueprintjs/core";

interface ResultViewProps {
  report: RunReportItem[];
  includeHeadings: boolean;
}

const nonBreakingHyphen = "‑";

const formatLineNumber = ({ lineStart, lineEnd }: RunDocumentSegment) =>
  lineStart === lineEnd
    ? lineStart
    : `${lineStart}${nonBreakingHyphen}${lineEnd}`;

const ResultView: React.FC<ResultViewProps> = ({
  report,
  includeHeadings = true,
}) => (
  <ol>
    {report.map((reportItem) => (
      <Box as="li" flexDirection="column" key={reportItem.id} mb={32}>
        <h3 className="bp4-heading" hidden={!includeHeadings}>
          Appears in {reportItem.docs.length} sources{" "}
          <Typo muted>{reportItem.docs.map((doc) => doc.name).join(", ")}</Typo>
        </h3>
        <table className="result-view__table bp4-html-table bp4-html-tabl2e-bordered">
          <thead>
            <tr>
              <th colSpan={reportItem.docs.length}>
                <Tooltip
                  content={reportItem.docs.map((doc) => doc.name).join(", ")}
                >
                  Line&nbsp;№
                </Tooltip>
              </th>

              <th>Segment</th>
            </tr>
          </thead>
          <tbody>
            {reportItem.results.map((result, index) => (
              <tr key={index}>
                {result.map((result) => (
                  <td key={result.id} title={result.doc.name}>
                    {result.segments
                      .map((segment) => formatLineNumber(segment))
                      .join(", ")}
                  </td>
                ))}
                <td className="result-view__table__segment">
                  <Typo as="pre" monospace>
                    {result[0].segments[0].original}
                  </Typo>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    ))}
  </ol>
);

export default ResultView;
