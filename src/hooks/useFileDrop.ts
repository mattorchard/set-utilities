import { useWindowEvent } from "./useWindowEvent";
import { useCallback } from "react";

const isDraggingFiles = (event: DragEvent) =>
  event.dataTransfer?.types?.some((type) => type.toLowerCase() === "files");

export const useFileDrop = (onDrop: (files: File[]) => void) => {
  const onDropHandler = useCallback(
    (event: DragEvent) => {
      if (!isDraggingFiles(event)) return;
      event.preventDefault();
      const fileList = event.dataTransfer?.files;
      if (fileList && fileList?.length) onDrop([...fileList]);
    },
    [onDrop]
  );
  useWindowEvent("drop", onDropHandler);

  const preventFileDefault = useCallback((event: DragEvent) => {
    if (isDraggingFiles(event)) event.preventDefault();
  }, []);
  useWindowEvent("dragover", preventFileDefault);
  useWindowEvent("dragenter", preventFileDefault);
};
