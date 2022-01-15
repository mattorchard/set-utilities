import React, { FormEvent, useRef, useState } from "react";
import { getFileContents } from "../helpers/fileHelpers";
import Spinner from "./Spinner";
import { createId } from "../helpers/idHelpers";

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
      <button
        type="button"
        onClick={() => inputRef.current.click()}
        disabled={isReadingFile}
      >
        {isReadingFile ? <Spinner /> : "Add file"}
      </button>
      <button type="button" onClick={addRawSource}>
        Add Text
      </button>
      <ul>
        {fileSources.map((fileSource) => (
          <li key={fileSource.id}>
            {fileSource.name}
            <span>{fileSource.content.substring(0, 100)}</span>
            <button
              title="Remove file"
              onClick={() => removeFile(fileSource.id)}
            >
              &times;
            </button>
          </li>
        ))}
      </ul>
      {rawSourceIds.map((id, index) => (
        <fieldset key={id}>
          <label>
            Name
            <input
              type="text"
              required
              name={sourceName(id)}
              defaultValue={`Source ${index + 1}`}
              placeholder="Source Name"
            />
          </label>
          <label>
            Content
            <textarea name={contentName(id)} />
          </label>
          <button
            type="button"
            onClick={() => removeRawSource(id)}
            title="Remove source"
          >
            &times;
          </button>
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
