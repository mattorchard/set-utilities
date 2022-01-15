import React, { useMemo } from "react";

interface TypoProps {
  as?: keyof JSX.IntrinsicElements;
  monospace?: boolean;
  large?: boolean;
  small?: boolean;
  muted?: boolean;
  disabled?: boolean;
  ellipsis?: boolean;
  className?: string;
}

const condClass = (condition: boolean, name: string) =>
  condition ? `bp4-${name}` : "";

const Typo: React.FC<TypoProps> = ({
  as: As = "span",
  monospace = false,
  large = false,
  small = false,
  muted = false,
  disabled = false,
  ellipsis = false,
  className = "",
  children,
}) => {
  const fullClassName = useMemo(
    () =>
      [
        className,
        condClass(monospace, "monospace-text"),
        condClass(large, "text-large"),
        condClass(small, "text-small"),
        condClass(muted, "text-muted"),
        condClass(disabled, "text-disabled"),
        condClass(ellipsis, "text-overflow-ellipsis"),
      ].join(" "),
    [monospace, large, small, muted, disabled, ellipsis, className]
  );
  return <As className={fullClassName}>{children}</As>;
};

export default Typo;
