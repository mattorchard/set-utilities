import React, { Fragment } from "react";
import Typo from "./Typo";
import "./ResultView.css";
import { Tooltip } from "@blueprintjs/core";
import Box from "./Box";

interface ResultViewProps {
  report: RunReportItem[];
  isNamesEnabled: boolean;
}

interface TooltipTextProps {
  lineStart: number;
  lineEnd: number;
  name: string;
}
const TooltipText = ({ lineStart, lineEnd, name }: TooltipTextProps) => (
  <span>
    <strong>{name}</strong>{" "}
    {lineStart === lineEnd ? (
      lineStart
    ) : (
      <>
        {lineStart}-{lineEnd}
      </>
    )}
  </span>
);

const ResultView: React.FC<ResultViewProps> = ({ report, isNamesEnabled }) => (
  <ol>
    {report.map((reportItem) => (
      <Box as="li" flexDirection="column" key={reportItem.id}>
        {isNamesEnabled && (
          <Typo large>
            In docs ({reportItem.docs.map((r) => r.name).join(", ")})
          </Typo>
        )}
        {reportItem.results.map((results, index) => (
          <Tooltip
            content={
              <pre>
                {results.map((result) =>
                  result.lines.map((r, index) => (
                    <Fragment key={index}>
                      <TooltipText
                        lineStart={r.lineStart}
                        lineEnd={r.lineEnd}
                        name={result.doc.name}
                      />
                      <br />
                    </Fragment>
                  ))
                )}
              </pre>
            }
          >
            <Typo key={index} monospace className="result__preview">
              {results[0].lines[0].original}
            </Typo>
          </Tooltip>
        ))}
      </Box>
    ))}
  </ol>
);

export default ResultView;
