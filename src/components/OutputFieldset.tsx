import React from "react";
import { Button, Icon, Switch } from "@blueprintjs/core";
import Box from "./Box";
import "./OutputFieldset.css";

interface OutputFieldsetProps {
  isSubmitEnabled: boolean;
  hasOutput: boolean;
  options: OutputViewOptions;
  onOptionsChanged: (options: OutputViewOptions) => void;
}

const OutputFieldset: React.FC<OutputFieldsetProps> = ({
  isSubmitEnabled,
  hasOutput,
  options,
  onOptionsChanged,
}) => (
  <Box mb={8} alignItems="start" as="fieldset" className="output-fieldset">
    <Button
      intent={hasOutput || !isSubmitEnabled ? "none" : "primary"}
      large
      type="submit"
      disabled={!isSubmitEnabled}
      icon={<Icon icon="tick-circle" />}
      title={
        isSubmitEnabled ? "" : "You must have at least two sources to compare"
      }
    >
      Calculate
    </Button>
    {hasOutput && (
      <Box ml="auto" flexDirection="column">
        <Switch
          labelElement="Headings"
          checked={options.isHeadingEnabled}
          onChange={(e) =>
            onOptionsChanged({
              ...options,
              isHeadingEnabled: e.currentTarget.checked,
            })
          }
        />
        <Switch
          labelElement="Line №"
          checked={options.isLineNumberEnabled}
          onChange={(e) =>
            onOptionsChanged({
              ...options,
              isLineNumberEnabled: e.currentTarget.checked,
            })
          }
        />
      </Box>
    )}
  </Box>
);

export default OutputFieldset;
