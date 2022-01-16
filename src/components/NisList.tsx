import React from "react";

interface NisListProps {
  list: any;
  defaultRender: () => React.ReactElement;
  emptyRender: () => React.ReactElement;
  nonListRender: () => React.ReactElement;
}

const NisList: React.FC<NisListProps> = ({
  list,
  defaultRender,
  emptyRender,
  nonListRender,
}) => {
  if (!Array.isArray(list)) return nonListRender();

  if (list.length === 0) return emptyRender();

  return defaultRender();
};

export default NisList;
