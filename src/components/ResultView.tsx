import React, { useRef } from "react";
import Typo from "./Typo";
import "./ResultView.css";
import Box from "./Box";
import { Tooltip2 as Tooltip, ContextMenu2 } from "@blueprintjs/popover2";
import { Menu, MenuItem } from "@blueprintjs/core";
import { deselect, selectElement } from "../helpers/selectionHelpers";
import { createId } from "../helpers/idHelpers";

interface ResultViewProps {
  report: RunReportItem[];
  includeHeadings: boolean;
  includeLineNumbers: boolean;
  onAddReplacement: (replacement: RunReplacement) => void;
}

const nonBreakingHyphen = "‑";

const formatLineNumber = ({ lineStart, lineEnd }: RunDocumentSegment) =>
  lineStart === lineEnd
    ? lineStart
    : `${lineStart}${nonBreakingHyphen}${lineEnd}`;

const ResultView: React.FC<ResultViewProps> = React.memo(
  ({
    report,
    onAddReplacement,
    includeHeadings = true,
    includeLineNumbers = true,
  }) => {
    const rowDataRef = useRef<RowInfo | null>(null);

    const handleContextMenu = (e: React.MouseEvent) => {
      const rowElement = (e.target as HTMLElement).closest(
        "tr[data-container]"
      ) as HTMLTableRowElement | null;
      if (!rowElement) {
        rowDataRef.current = null;
        return;
      }
      rowDataRef.current = {
        element: rowElement,
        reportIndex: parseInt(rowElement.dataset.reportIndex!),
        resultIndex: parseInt(rowElement.dataset.resultIndex!),
      };
    };

    const handleSelectSegment = () => {
      if (!rowDataRef.current) return;
      selectElement(rowDataRef.current.element.lastElementChild!);
    };

    const handleCopySegment = () => {
      if (!rowDataRef.current) return;
      handleSelectSegment();
      document.execCommand("copy");
      deselect();
    };

    const handleReplace = () => {
      if (!rowDataRef.current) return;
      const { reportIndex, resultIndex } = rowDataRef.current;
      const results = report[reportIndex]?.results[resultIndex];
      const docs = report[reportIndex]?.docs;
      if (!results || !docs) return;
      onAddReplacement({
        id: createId(),
        docs,
        results,
        replacement: "",
      });
    };

    return (
      <ol>
        {report.map((reportItem, reportIndex) => (
          <Box as="li" flexDirection="column" key={reportItem.id} mb={32}>
            <h3 className="bp4-heading" hidden={!includeHeadings}>
              Appears in {reportItem.docs.length} sources{" "}
              <Typo muted>
                {reportItem.docs.map((doc) => doc.name).join(", ")}
              </Typo>
            </h3>
            <ContextMenu2
              onContextMenu={handleContextMenu}
              content={
                <Menu>
                  <MenuItem
                    text="Copy"
                    icon="duplicate"
                    onClick={handleCopySegment}
                  />
                  <MenuItem
                    text="Select"
                    icon="text-highlight"
                    onClick={handleSelectSegment}
                  />
                  <MenuItem
                    text="Replace"
                    icon="fork"
                    onClick={handleReplace}
                  />
                </Menu>
              }
            >
              <table className="result-view__table bp4-html-table bp4-interactive">
                {includeLineNumbers && (
                  <thead>
                    <tr>
                      <th colSpan={reportItem.docs.length}>
                        <Tooltip
                          content={
                            <Typo as="pre">
                              {reportItem.docs
                                .map((doc) => doc.name)
                                .join(",\n")}
                            </Typo>
                          }
                        >
                          Line&nbsp;№
                        </Tooltip>
                      </th>

                      <th>Segment</th>
                    </tr>
                  </thead>
                )}
                <tbody>
                  {reportItem.results.map((result, index) => (
                    <tr
                      key={index}
                      data-container={true}
                      data-report-index={reportIndex}
                      data-result-index={index}
                    >
                      {includeLineNumbers &&
                        result.map((result) => (
                          <td key={result.id} title={result.doc.name}>
                            {result.segments
                              .map((segment) => formatLineNumber(segment))
                              .join(", ")}
                          </td>
                        ))}
                      <td className="result-view__table__segment">
                        <Typo as="pre" monospace>
                          {result[0].preview}
                        </Typo>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ContextMenu2>
          </Box>
        ))}
      </ol>
    );
  }
);

interface RowInfo {
  element: HTMLTableRowElement;
  reportIndex: number;
  resultIndex: number;
}

export default ResultView;
