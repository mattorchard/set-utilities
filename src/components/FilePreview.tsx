import React, { useMemo } from "react";
import Typo from "./Typo";
import "./FilePreview.css";

interface FilePreviewProps {
  content: string;
  previewLength?: number;
}

const FilePreview: React.FC<FilePreviewProps> = ({
  content,
  previewLength = 100,
}) => {
  const preview = useMemo(
    () => content.substring(0, previewLength),
    [content, previewLength]
  );
  return (
    <Typo as="p" className="file-preview" monospace style={{ marginBottom: 0 }}>
      {preview}
      {content.length > previewLength && "…"}
    </Typo>
  );
};

export default FilePreview;
