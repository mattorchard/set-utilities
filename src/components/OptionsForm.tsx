import React, { FormEvent, useState } from "react";
import {
  FormGroup,
  InputGroup,
  NumericInput,
  Radio,
  RadioGroup,
  Switch,
} from "@blueprintjs/core";
import Typo from "./Typo";

interface OptionsFormProps {
  onSubmit: (options: RunOptions) => void;
}

const booleanFromCheckbox = (value: any) => value === "on";

const OptionsForm: React.FC<OptionsFormProps> = ({ onSubmit }) => {
  const [selectedOperation, setSelectedOperation] = useState("intersection");
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
      <Switch
        name="ignoreWhitespace"
        defaultChecked
        label="Ignore Whitespace"
      />

      <Switch name="ignoreCase" defaultChecked label="Ignore Case" />

      <FormGroup>
        <Typo large>Delimiter (Regex)</Typo>
        <InputGroup
          name="delimiter"
          defaultValue="\r?\n"
          style={{ maxWidth: 16 * 5 }}
        />
      </FormGroup>

      <FormGroup>
        <Typo large>Minimum Length</Typo>
        <NumericInput
          name="minLength"
          defaultValue="1"
          min={0}
          stepSize={1}
          style={{ maxWidth: 16 * 3 }}
        />
      </FormGroup>

      <RadioGroup
        label={<Typo large>Operation</Typo>}
        selectedValue={selectedOperation}
        onChange={(e) => setSelectedOperation(e.currentTarget.value)}
        name="operation"
      >
        <Radio label="Intersection" value="intersection" />
        <Radio label="Unique" value="unique" />
        <Radio label="Common" value="common" />
      </RadioGroup>

      <button type="submit">Next</button>
    </form>
  );
};

export default OptionsForm;
