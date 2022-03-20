import React, { useCallback, useMemo, useRef, useState } from "react";
import { getFileContents } from "../helpers/fileHelpers";
import { createId } from "../helpers/idHelpers";
import { Button, Icon, NonIdealState, TextArea } from "@blueprintjs/core";
import { Tooltip2 as Tooltip } from "@blueprintjs/popover2";
import FilePreview from "./FilePreview";
import Box from "./Box";
import Typo from "./Typo";
import { useFileDrop } from "../hooks/useFileDrop";
import ExpandingRemoveButton from "./ExpandingRemoveButton";

interface SourcesFieldsetProps {
  sources: RunSource[];
  onAddSources: (sources: RunSource[]) => void;
  onRemoveSource: (id: string) => void;
  onSourceChange: (source: RunSourceChange) => void;
}

const getFirstUnusedName = (sources: RunSource[]): string => {
  let highestSourceName = sources.length;
  sources.forEach((source) => {
    const sourceNumber = Number(source.name.replace(/^Source /, ""));
    if (sourceNumber)
      highestSourceName = Math.max(sourceNumber, highestSourceName);
  });
  return `Source ${highestSourceName + 1}`;
};

const SourcesFieldset: React.FC<SourcesFieldsetProps> = ({
  sources,
  onAddSources,
  onRemoveSource,
  onSourceChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(undefined!);
  const [isReadingFile, setIsReadingFiles] = useState(false);
  const [refreshPressed, setRefreshPressed] = useState(false);

  const sourceWithHandleCount = useMemo(
    () => sources.filter((source) => source.handle).length,
    [sources]
  );

  const handleAddRawSource = () =>
    onAddSources([
      {
        id: createId(),
        name: getFirstUnusedName(sources),
        content: "",
        type: "raw",
      },
    ]);

  const addFilesWithoutHandles = useCallback(
    async (files: File[]) => {
      try {
        setIsReadingFiles(true);
        const fileContents = await Promise.all(files.map(getFileContents));
        onAddSources(
          fileContents.map((content, index) => ({
            content,
            name: files[index].name,
            id: createId(),
            type: "file",
          }))
        );
      } finally {
        setIsReadingFiles(false);
      }
    },
    [onAddSources]
  );

  useFileDrop(addFilesWithoutHandles);

  const addFilesWithHandles = async () => {
    try {
      setIsReadingFiles(true);
      const handles = await showOpenFilePicker({
        multiple: true,
      });
      const fileHandles = handles.filter((handle) => handle.kind === "file");
      const fileContents = await Promise.all(
        fileHandles.map(
          async (handle) => await getFileContents(await handle.getFile())
        )
      );
      onAddSources(
        fileContents.map((content, index) => ({
          content,
          name: fileHandles[index].name,
          handle: fileHandles[index],
          id: createId(),
          type: "file",
        }))
      );
    } finally {
      setIsReadingFiles(false);
    }
  };

  const handleRefreshFromHandles = async () => {
    try {
      setRefreshPressed(true);
      setIsReadingFiles(true);
      await Promise.all(
        sources
          .filter((s) => s.handle)
          .map(async ({ id, handle }) => {
            await handle!.requestPermission({ mode: "read" });
            const content = await getFileContents(await handle!.getFile());
            onSourceChange({ id, content });
          })
      );
    } finally {
      setIsReadingFiles(false);
    }
  };

  const handleClickAddFile = async () => {
    if ("showOpenFilePicker" in window) {
      await addFilesWithHandles();
    } else {
      // Fall back to hidden file input
      fileInputRef.current.click();
    }
  };

  const handleFilesSelected = async () => {
    const input = fileInputRef.current;
    if (!input || !input.files || !input.files.length) return;
    const files = [...input.files];
    input.value = "";
    await addFilesWithoutHandles(files);
  };

  return (
    <fieldset>
      <Box mb={8}>
        <Box>
          <Button
            onClick={handleClickAddFile}
            loading={isReadingFile}
            icon={<Icon icon="folder-new" />}
            intent={sources.length >= 2 ? "none" : "primary"}
            large
          >
            Add File
          </Button>
        </Box>
        <Box ml={8}>
          <Button
            onClick={handleAddRawSource}
            icon={<Icon icon="new-text-box" />}
            intent={sources.length >= 2 ? "none" : "primary"}
            large
          >
            Add Text
          </Button>
        </Box>
        {sourceWithHandleCount > 0 && (
          <Box ml="auto">
            <Tooltip
              content={`Reload ${sourceWithHandleCount} connected sources`}
            >
              <Button
                icon={<Icon icon="refresh" />}
                large
                minimal
                aria-label="Refresh"
                onClick={handleRefreshFromHandles}
                loading={isReadingFile}
              />
            </Tooltip>
          </Box>
        )}
      </Box>

      <ul className="non-list">
        {sources.map((source) => (
          <Box
            key={source.id}
            as="li"
            mb={16}
            flexDirection="column"
            className="illuminate"
          >
            <Box my={4} justifyContent="space-between">
              {source.type === "file" ? (
                <Typo large>
                  <strong>{source.name}</strong>
                </Typo>
              ) : (
                <input
                  type="text"
                  className="bp4-input"
                  aria-label="Source Name"
                  placeholder="Source Name"
                  defaultValue={source.name}
                  onBlur={(event) =>
                    onSourceChange({
                      id: source.id,
                      name: event.currentTarget.value,
                    })
                  }
                />
              )}
              <ExpandingRemoveButton
                onClick={() => onRemoveSource(source.id)}
              />
            </Box>

            {source.type === "file" ? (
              <Box flexDirection="column">
                <FilePreview content={source.content} />
                {refreshPressed && !source.handle && (
                  <Typo small>This source cannot be refreshed.</Typo>
                )}
              </Box>
            ) : (
              <TextArea
                aria-label="Content"
                growVertically
                fill
                placeholder="Lorem ipsum"
                style={{ resize: "vertical" }}
                defaultValue={source.content}
                onBlur={(event) =>
                  onSourceChange({
                    id: source.id,
                    content: event.currentTarget.value,
                  })
                }
              />
            )}
          </Box>
        ))}
      </ul>
      {sources.length < 2 && (
        <NonIdealState icon="folder-open">
          <h3 className="bp4-heading">
            {sources.length === 0
              ? "Add sources for comparison"
              : "Add at least one more source"}
          </h3>
          <p>Each source's content will be used to generate the results.</p>
        </NonIdealState>
      )}
      <input
        type="file"
        hidden
        multiple
        ref={fileInputRef}
        onChange={handleFilesSelected}
      />
    </fieldset>
  );
};

export default SourcesFieldset;
