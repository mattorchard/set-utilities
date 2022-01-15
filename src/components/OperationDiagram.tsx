import React, { ReactElement } from "react";

interface OperationDiagramProps {
  operation: RunOperation;
}

const OperationSvgs: Record<RunOperation, ReactElement> = {
  intersection: <svg />,
  unique: <svg />,
  common: <svg />,
};

const OperationDiagram: React.FC<OperationDiagramProps> = ({ operation }) =>
  OperationSvgs[operation];

export default OperationDiagram;
