import React, { useEffect, useRef, useState } from "react";
import { getFileContents } from "../helpers/fileHelpers";
import { createId } from "../helpers/idHelpers";
import { Button, Icon, NonIdealState, TextArea } from "@blueprintjs/core";
import FilePreview from "./FilePreview";
import Box from "./Box";
import Typo from "./Typo";

interface SourcesFieldsetProps {
  onChange: (source: RunSource[]) => void;
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

const SourcesFieldset: React.FC<SourcesFieldsetProps> = ({ onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(undefined!);
  const [isReadingFile, setIsReadingFiles] = useState(false);
  const [sources, setSources] = useState<RunSource[]>([]);

  useEffect(() => {
    onChange(sources);
  }, [onChange, sources]);

  const handleRemoveSource = (idToRemove: string) =>
    setSources((sources) =>
      sources.filter((source) => source.id !== idToRemove)
    );

  const handleAddRawSource = () =>
    setSources((sources) => [
      {
        id: createId(),
        name: getFirstUnusedName(sources),
        content: "",
        type: "raw",
      },
      ...sources,
    ]);

  const handleAddFiles = async (files: File[]) => {
    try {
      setIsReadingFiles(true);
      const fileContents = await Promise.all(files.map(getFileContents));
      const newFileSources: RunSource[] = fileContents.map(
        (content, index) => ({
          content,
          name: files[index].name,
          id: createId(),
          type: "file",
        })
      );
      setSources((existingSources) => [...newFileSources, ...existingSources]);
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

  const handleEditSourceName = (id: string, name: string) =>
    setSources((sources) =>
      sources.map((source) => (source.id === id ? { ...source, name } : source))
    );
  const handleEditSourceContent = (id: string, content: string) =>
    setSources((sources) =>
      sources.map((source) =>
        source.id === id ? { ...source, content } : source
      )
    );

  return (
    <fieldset>
      <Box mr={8} inline mb={8}>
        <Button
          onClick={() => fileInputRef.current.click()}
          loading={isReadingFile}
          icon={<Icon icon="folder-new" />}
          intent="primary"
          large
        >
          Add File
        </Button>
      </Box>
      <Box inline mb={8}>
        <Button
          onClick={handleAddRawSource}
          icon={<Icon icon="new-text-box" />}
          intent="primary"
          large
        >
          Add Text
        </Button>
      </Box>
      <ul className="non-list">
        {sources.map((source) => (
          <Box key={source.id} as="li" mb={16} flexDirection="column">
            <SourceHeader onRemove={() => handleRemoveSource(source.id)}>
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
                    handleEditSourceName(source.id, event.currentTarget.value)
                  }
                />
              )}
            </SourceHeader>
            {source.type === "file" ? (
              <FilePreview content={source.content} />
            ) : (
              <TextArea
                aria-label="Content"
                growVertically
                fill
                placeholder="Lorem ipsum"
                style={{ resize: "vertical" }}
                onBlur={(event) =>
                  handleEditSourceContent(source.id, event.currentTarget.value)
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

const SourceHeader: React.FC<{
  onRemove: () => void;
}> = ({ onRemove, children }) => (
  <Box my={4} justifyContent="space-between">
    {children}
    <Button
      type="button"
      onClick={onRemove}
      intent="danger"
      minimal
      icon={<Icon icon="delete" intent="primary" />}
    >
      Remove
    </Button>
  </Box>
);

export default SourcesFieldset;
