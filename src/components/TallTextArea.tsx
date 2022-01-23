import React, { useEffect, useRef } from "react";
import { TextArea, TextAreaProps } from "@blueprintjs/core";

const TallTextArea: React.FC<TextAreaProps> = (props) => {
  const ref = useRef<HTMLTextAreaElement>(undefined!);
  useEffect(() => {
    ref.current.style.height = ref.current.scrollHeight + "px";
  }, []);
  return (
    <TextArea
      {...props}
      growVertically
      style={{ resize: "vertical" }}
      inputRef={ref}
    />
  );
};

export default TallTextArea;
