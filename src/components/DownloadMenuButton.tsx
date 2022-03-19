import React from "react";
import { Button, Menu, MenuItem } from "@blueprintjs/core";
import { Popover2 as Popover } from "@blueprintjs/popover2";

interface DownloadMenuButtonProps {
  onSaveInPlace: () => void;
  isSaveInPlaceEnabled: boolean;
  onDownloadAll: () => void;
  onDownloadModified: () => void;
}

const DownloadMenuButton: React.FC<DownloadMenuButtonProps> = ({
  isSaveInPlaceEnabled,
  onSaveInPlace,
  onDownloadAll,
  onDownloadModified,
}) => (
  <Popover
    placement="bottom"
    content={
      <Menu>
        {isSaveInPlaceEnabled && (
          <MenuItem
            text="Save over originals"
            icon="floppy-disk"
            onClick={onSaveInPlace}
          />
        )}
        <MenuItem
          text="All sources"
          icon="multi-select"
          onClick={onDownloadAll}
        />
        <MenuItem
          text="Modified sources"
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
