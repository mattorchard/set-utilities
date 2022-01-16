import React, { FormEvent, useRef, useState } from "react";
import { getFileContents } from "../helpers/fileHelpers";
import { createId } from "../helpers/idHelpers";
import { Button, Icon, TextArea } from "@blueprintjs/core";
import FilePreview from "./FilePreview";
import Box from "./Box";
import Typo from "./Typo";

const sourceName = (id: string) => `sourceName_${id}`;
const contentName = (id: string) => `content_${id}`;

interface SourcesFormProps {
  onSubmit: (source: RunSource[]) => void;
}

const SourcesForm: React.FC<SourcesFormProps> = ({ onSubmit }) => {
  const inputRef = useRef<HTMLInputElement>(undefined!);
  const [isReadingFile, setIsReadingFiles] = useState(false);
  const [fileSources, setFileSources] = useState<RunSource[]>([]);
  const [rawSourceIds, setRawSourceIds] = useState<string[]>([]);

  const addRawSource = () => setRawSourceIds((s) => [...s, createId()]);

  const removeRawSource = (idToRemove: string) =>
    setRawSourceIds((s) => s.filter((id) => id !== idToRemove));

  const addFiles = async (files: File[]) => {
    try {
      setIsReadingFiles(true);
      const fileContents = await Promise.all(files.map(getFileContents));
      const newFileSources = fileContents.map((content, index) => ({
        content,
        name: files[index].name,
        id: createId(),
      }));
      setFileSources((existingSources) => [
        ...existingSources,
        ...newFileSources,
      ]);
    } finally {
      setIsReadingFiles(false);
    }
  };

  const removeFile = (sourceIdToRemove: string) =>
    setFileSources((sources) =>
      sources.filter((source) => source.id !== sourceIdToRemove)
    );

  const handleFileSelected = async () => {
    const input = inputRef.current;
    if (!input || !input.files || !input.files.length) return;
    const files = [...input.files];
    input.value = "";
    await addFiles(files);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const rawSources = rawSourceIds.map((id) => ({
      id,
      name: formData.get(sourceName(id)) as string,
      content: formData.get(contentName(id)) as string,
    }));
    onSubmit([...rawSources, ...fileSources]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Button
        onClick={() => inputRef.current.click()}
        loading={isReadingFile}
        icon={<Icon icon="folder-new" />}
      >
        Add File
      </Button>
      <Button onClick={addRawSource} icon={<Icon icon="new-text-box" />}>
        Add Text
      </Button>
      <ul className="non-list">
        {fileSources.map((fileSource) => (
          <li key={fileSource.id}>
            <Box my={4} justifyContent="space-between">
              <Typo large>
                <strong>{fileSource.name}</strong>
              </Typo>
              <Button
                type="button"
                onClick={() => removeFile(fileSource.id)}
                intent="danger"
                minimal
                icon={<Icon icon="delete" intent="primary" />}
              >
                Remove
              </Button>
            </Box>
            <FilePreview content={fileSource.content} />
          </li>
        ))}
      </ul>
      {rawSourceIds.map((id, index) => (
        <fieldset key={id}>
          <Box my={4} justifyContent="space-between">
            <input
              type="text"
              className="bp4-input"
              required
              name={sourceName(id)}
              defaultValue={`Source ${index + 1}`}
              aria-label="Source Name"
              placeholder="Source Name"
            />

            <Button
              type="button"
              onClick={() => removeRawSource(id)}
              intent="danger"
              minimal
              icon={<Icon icon="delete" intent="primary" />}
            >
              Remove
            </Button>
          </Box>

          <TextArea
            aria-label="Content"
            growVertically
            fill
            name={contentName(id)}
            placeholder="Lorem ipsum"
            style={{ resize: "vertical" }}
          />
        </fieldset>
      ))}
      <button type="submit">Next</button>
      <input
        type="file"
        hidden
        ref={inputRef}
        onChange={handleFileSelected}
        multiple
      />
    </form>
  );
};

export default SourcesForm;
