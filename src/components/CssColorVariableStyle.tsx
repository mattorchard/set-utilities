import React from "react";
import { Colors } from "@blueprintjs/colors";

const formatName = (name: string) =>
  name
    .split(/(\d+)|_/)
    .filter(Boolean)
    .join("-")
    .toLowerCase();

const styleText = `:root {
${[...Object.entries(Colors)]
  .map(([name, hex]) => `--${formatName(name)}: ${hex};`)
  .join("\n")}
}`;

const CssColorVariableStyle: React.FC = () => <style>{styleText}</style>;

export default CssColorVariableStyle;
