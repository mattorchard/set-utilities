import React from "react";
import { Button, Menu, MenuItem } from "@blueprintjs/core";
import { Popover2 as Popover } from "@blueprintjs/popover2";

interface DownloadMenuButtonProps {
  onDownloadAll: () => void;
  onDownloadModified: () => void;
}

const DownloadMenuButton: React.FC<DownloadMenuButtonProps> = ({
  onDownloadAll,
  onDownloadModified,
}) => (
  <Popover
    placement="bottom"
    content={
      <Menu>
        <MenuItem
          text="All Sources"
          icon="multi-select"
          onClick={onDownloadAll}
        />
        <MenuItem
          text="Modified Sources"
          icon="changes"
          onClick={onDownloadModified}
        />
      </Menu>
    }
  >
    <Button icon="download" rightIcon="caret-down" large intent="primary">
      Download
    </Button>
  </Popover>
);

export default DownloadMenuButton;
