import React from "react";
import { Button, Callout } from "@blueprintjs/core";
import "./RestoreBundleMessage.css";

interface RestoreBundleMessageProps {
  isEnabled: boolean;
  onRestore: () => void;
  onDismiss: () => void;
}

const RestoreBundleMessage: React.FC<RestoreBundleMessageProps> = ({
  isEnabled,
  onRestore,
  onDismiss,
}) => (
  <Callout
    icon="floppy-disk"
    title="Pick up where you left off?"
    className={`restore-bundle-message ${
      isEnabled || "restore-bundle-message--hidden"
    }`}
    intent="primary"
  >
    <p>Restore your sources, options, and replacements from last time</p>
    <Button intent="primary" onClick={onRestore} disabled={!isEnabled}>
      Restore
    </Button>
    <Button minimal onClick={onDismiss} disabled={!isEnabled}>
      Dismiss
    </Button>
  </Callout>
);

export default RestoreBundleMessage;
