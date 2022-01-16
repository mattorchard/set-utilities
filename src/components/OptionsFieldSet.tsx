import React, { useEffect, useState } from "react";
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
  onChange: (options: RunOptions) => void;
}

const OptionsFieldSet: React.FC<OptionsFormProps> = ({ onChange }) => {
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(true);
  const [ignoreCase, setIgnoreCase] = useState(true);
  const [delimiter, setDelimiter] = useState("\\r?\\n");
  const [minLength, setMinLength] = useState(1);
  const [operation, setOperation] = useState<RunOperation>("intersection");

  useEffect(() => {
    onChange({
      ignoreWhitespace,
      ignoreCase,
      delimiter,
      operation,
      minLength,
    });
  }, [ignoreWhitespace, ignoreCase, delimiter, minLength, operation]);

  return (
    <fieldset className="options-form">
      <Switch
        label="Ignore Whitespace"
        checked={ignoreWhitespace}
        onChange={(e) => setIgnoreWhitespace(e.currentTarget.checked)}
      />

      <Switch
        label="Ignore Case"
        checked={ignoreCase}
        onChange={(e) => setIgnoreCase(e.currentTarget.checked)}
      />

      <FormGroup>
        <Typo large>Delimiter (Regex)</Typo>
        <InputGroup
          value={delimiter}
          onChange={(e) => setDelimiter(e.currentTarget.value)}
          style={{ maxWidth: 16 * 5 }}
        />
      </FormGroup>

      <FormGroup>
        <Typo large>Minimum Length</Typo>
        <NumericInput
          min={0}
          stepSize={1}
          defaultValue="1"
          onValueChange={(minLength) => setMinLength(minLength)}
          style={{ maxWidth: 16 * 3 }}
        />
      </FormGroup>

      <RadioGroup
        label={<Typo large>Operation</Typo>}
        selectedValue={operation}
        onChange={(e) => setOperation(e.currentTarget.value as RunOperation)}
        name="operation"
      >
        <Radio label="Intersection" value="intersection" />
        <Radio label="Unique" value="unique" />
        <Radio label="Common" value="common" />
      </RadioGroup>
    </fieldset>
  );
};

export default OptionsFieldSet;
