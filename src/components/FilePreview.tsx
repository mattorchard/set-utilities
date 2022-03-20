import React, { useEffect, useRef, useState } from "react";
import Typo from "./Typo";
import { Button } from "@blueprintjs/core";
import "./FilePreview.css";

interface FilePreviewProps {
  content: string;
}

const FilePreview: React.FC<FilePreviewProps> = ({ content }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(undefined!);
  useEffect(() => {
    ref.current.style.setProperty(
      "--scroll-height",
      `${ref.current.scrollHeight}px`
    );
  }, [content]);
  return (
    <div
      ref={ref}
      className={`file-preview ${isExpanded && "file-preview--expanded"}`}
    >
      <div className="file-preview__content">
        <Typo as="code" monospace>
          {content}
        </Typo>
      </div>
      <Button
        className="expand-button"
        icon="chevron-down"
        title={isExpanded ? "Collapse" : "Expand"}
        aria-label={isExpanded ? "Collapse" : "Expand"}
        onClick={() => setIsExpanded((e) => !e)}
      />
    </div>
  );
};

export default FilePreview;
