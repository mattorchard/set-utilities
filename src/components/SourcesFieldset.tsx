import React, { useCallback, useRef, useState } from "react";
import { getFileContents } from "../helpers/fileHelpers";
import { createId } from "../helpers/idHelpers";
import { Button, Icon, NonIdealState, TextArea } from "@blueprintjs/core";
import FilePreview from "./FilePreview";
import Box from "./Box";
import Typo from "./Typo";
import { useFileDrop } from "../hooks/useFileDrop";

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

  const handleAddRawSource = () =>
    onAddSources([
      {
        id: createId(),
        name: getFirstUnusedName(sources),
        content: "",
        type: "raw",
      },
    ]);

  const handleAddFiles = useCallback(
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

  useFileDrop(handleAddFiles);

  const handleClickAddFile = async () => {
    if (!("showOpenFilePicker" in window)) {
      fileInputRef.current.click();
      return;
    }
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

  const handleFilesSelected = async () => {
    const input = fileInputRef.current;
    if (!input || !input.files || !input.files.length) return;
    const files = [...input.files];
    input.value = "";
    await handleAddFiles(files);
  };

  return (
    <fieldset>
      <Box mr={8} inline mb={8}>
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
      <Box inline mb={8}>
        <Button
          onClick={handleAddRawSource}
          icon={<Icon icon="new-text-box" />}
          intent={sources.length >= 2 ? "none" : "primary"}
          large
        >
          Add Text
        </Button>
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
              <Button
                type="button"
                onClick={() => onRemoveSource(source.id)}
                intent="danger"
                minimal
                icon={<Icon icon="delete" intent="primary" />}
              >
                Remove
              </Button>
            </Box>

            {source.type === "file" ? (
              <FilePreview content={source.content} />
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
