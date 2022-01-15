import React from "react";
import "./Spinner.css";

interface SpinnerProps {}

const Spinner: React.FC<SpinnerProps> = () => (
  <span className="spinner" aria-label="Loading" title="Loading" />
);

export default Spinner;
