import React, { CSSProperties, useMemo } from "react";
import { Classes } from "@blueprintjs/core";

interface TypoProps {
  as?: keyof JSX.IntrinsicElements;
  monospace?: boolean;
  large?: boolean;
  small?: boolean;
  muted?: boolean;
  disabled?: boolean;
  ellipsis?: boolean;
  className?: string;
  style?: CSSProperties;
}

const condClass = (condition: boolean, name: string) => (condition ? name : "");

const Typo: React.FC<TypoProps> = ({
  as: As = "span",
  monospace = false,
  large = false,
  small = false,
  muted = false,
  disabled = false,
  ellipsis = false,
  className = "",
  style,
  children,
}) => {
  const fullClassName = useMemo(
    () =>
      [
        className,
        condClass(monospace, Classes.MONOSPACE_TEXT),
        condClass(large, Classes.TEXT_LARGE),
        condClass(small, Classes.TEXT_SMALL),
        condClass(muted, Classes.TEXT_MUTED),
        condClass(disabled, Classes.DISABLED),
        condClass(ellipsis, Classes.TEXT_OVERFLOW_ELLIPSIS),
      ].join(" "),
    [monospace, large, small, muted, disabled, ellipsis, className]
  );
  return (
    <As className={fullClassName} style={style}>
      {children}
    </As>
  );
};

export default Typo;
