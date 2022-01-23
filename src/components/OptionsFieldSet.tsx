import React from "react";
import {
  FormGroup,
  InputGroup,
  NumericInput,
  Radio,
  RadioGroup,
  Switch,
} from "@blueprintjs/core";
import Typo from "./Typo";
import VennDiagram from "./VennDiagram";
import "./OptionsFieldset.css";

interface OptionsFormProps {
  options: RunOptions;
  onChange: (options: Partial<RunOptions>) => void;
}

const OptionsFieldSet: React.FC<OptionsFormProps> = ({ options, onChange }) => {
  const {
    ignoreWhitespace,
    ignoreCase,
    filter,
    delimiter,
    minLength,
    operation,
  } = options;

  return (
    <fieldset className="options-form">
      <RadioGroup
        label={
          <Typo large as="strong">
            Operation
          </Typo>
        }
        selectedValue={operation}
        onChange={(e) =>
          onChange({ operation: e.currentTarget.value as RunOperation })
        }
        name="operation"
        inline
      >
        <Radio label="Intersection" value="intersection" />
        <Radio label="Unique" value="unique" />
        <Radio label="Common" value="common" />
      </RadioGroup>

      <Switch
        label="Ignore Whitespace"
        checked={ignoreWhitespace}
        onChange={(e) =>
          onChange({ ignoreWhitespace: e.currentTarget.checked })
        }
      />

      <Switch
        label="Ignore Case"
        checked={ignoreCase}
        onChange={(e) => onChange({ ignoreCase: e.currentTarget.checked })}
      />

      <FormGroup>
        <Typo large>Filter (Regex)</Typo>
        <InputGroup
          value={filter || ""}
          onChange={(e) => onChange({ filter: e.currentTarget.value || null })}
          style={{ maxWidth: 16 * 10 }}
          placeholder="Any"
        />
      </FormGroup>

      <FormGroup>
        <Typo large>Delimiter (Regex)</Typo>
        <InputGroup
          value={delimiter}
          onChange={(e) => onChange({ delimiter: e.currentTarget.value })}
          style={{ maxWidth: 16 * 5 }}
          placeholder="\n"
        />
      </FormGroup>

      <FormGroup>
        <Typo large>Minimum Length</Typo>
        <NumericInput
          min={0}
          stepSize={1}
          value={minLength}
          onValueChange={(minLength) => onChange({ minLength })}
          style={{ maxWidth: 16 * 3 }}
        />
      </FormGroup>

      <div className="options-form__diagram-container">
        <VennDiagram operation={operation} />
      </div>
    </fieldset>
  );
};

export default OptionsFieldSet;
