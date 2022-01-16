import React, { CSSProperties } from "react";

type DivProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export interface BoxProps {
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  alignItems?: CSSProperties["alignItems"];
  justifyContent?: CSSProperties["justifyContent"];
  flexDirection?: CSSProperties["flexDirection"];
  inline?: boolean;
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

const Box: React.FC<BoxProps & DivProps> = ({
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
  inline,
  flexDirection,
  alignItems,
  justifyContent,
  className,
  as: As = "div",
  children,
  ...props
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
    display: inline ? "inline-flex" : "flex",
    flexDirection,
    alignItems,
    justifyContent,
  };

  return (
    // @ts-ignore
    <As {...props} className={className} style={style}>
      {children}
    </As>
  );
};

export default Box;
