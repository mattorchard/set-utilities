import React, { FormEvent } from "react";
import "./OptionsForm.css";

interface OptionsFormProps {
  onSubmit: (options: RunOptions) => void;
}

const booleanFromCheckbox = (value: any) => value === "on";

const OptionsForm: React.FC<OptionsFormProps> = ({ onSubmit }) => {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    onSubmit({
      ignoreWhitespace: booleanFromCheckbox(formData.get("ignoreWhitespace")),
      ignoreCase: booleanFromCheckbox(formData.get("ignoreCase")),
      operation: formData.get("operation") as RunOperation,
      delimiter: formData.get("delimiter") as string,
      minLength: parseInt(formData.get("minLength") as string) || 0,
    });
  };
  return (
    <form onSubmit={handleSubmit} className="options-form">
      <label>
        <input type="checkbox" name="ignoreWhitespace" defaultChecked />
        Ignore Whitespace
      </label>
      <label>
        <input type="checkbox" name="ignoreCase" defaultChecked />
        Ignore Case
      </label>
      <label>
        Delimiter
        <input type="text" name="delimiter" defaultValue="\r?\n" />
      </label>
      <label>
        Minimum Length
        <input type="number" name="minLength" defaultValue="1" />
      </label>
      <label>
        Operation
        <select name="operation">
          <option value="intersection">Intersection</option>
          <option value="unique">Unique</option>
          <option value="common">Common</option>
        </select>
      </label>
      <button type="submit">Next</button>
    </form>
  );
};

export default OptionsForm;
