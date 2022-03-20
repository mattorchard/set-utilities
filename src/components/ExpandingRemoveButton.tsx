import React from "react";
import { Button, Icon } from "@blueprintjs/core";
import "./ExpandingRemoveButton.css";

interface ExpandingRemoveButtonProps {
  onClick: () => void;
}

const ExpandingRemoveButton: React.FC<ExpandingRemoveButtonProps> = ({
  onClick,
}) => (
  <Button
    type="button"
    onClick={onClick}
    intent="danger"
    minimal
    icon={<Icon icon="delete" intent="primary" />}
    className="expanding-remove-button"
  >
    Remove
  </Button>
);

export default ExpandingRemoveButton;
