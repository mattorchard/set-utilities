import React from "react";
import "./CircleDot.css";
interface CircleDotProps {}

const CircleDot: React.FC<CircleDotProps> = ({ children }) => (
  <span className="circle-dot">{children}</span>
);

export default CircleDot;
