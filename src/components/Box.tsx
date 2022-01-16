import React, { CSSProperties } from "react";

export interface BoxProps {
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  alignItems?: CSSProperties["alignItems"];
  justifyContent?: CSSProperties["justifyContent"];
  flexDirection?: CSSProperties["flexDirection"];
  p?: number;
  px?: number;
  py?: number;
  pt?: number;
  pr?: number;
  pb?: number;
  pl?: number;
  m?: number;
  mx?: number;
  my?: number;
  mt?: number;
  mr?: number;
  mb?: number;
  ml?: number;
}

const Box: React.FC<BoxProps> = ({
  p,
  px,
  py,
  pt,
  pr,
  pb,
  pl,
  m,
  mx,
  my,
  mt,
  mr,
  mb,
  ml,
  flexDirection,
  alignItems,
  justifyContent,
  className,
  as: As = "div",
  children,
}) => {
  const style = {
    marginTop: mt ?? my ?? m,
    marginRight: mr ?? mx ?? m,
    marginBottom: mb ?? my ?? m,
    marginLeft: ml ?? mx ?? m,
    paddingTop: pt ?? py ?? p,
    paddingRight: pr ?? px ?? p,
    paddingBottom: pb ?? py ?? p,
    paddingLeft: pl ?? px ?? p,
    display: "flex",
    flexDirection,
    alignItems,
    justifyContent,
  };
  return (
    <As className={className} style={style}>
      {children}
    </As>
  );
};

export default Box;
