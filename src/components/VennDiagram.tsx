import React from "react";

interface VennDiagramProps {
  operation: RunOperation;
  strokeColor?: string;
  fillColor?: string;
}

const VennDiagram: React.FC<VennDiagramProps> = ({
  operation,
  strokeColor = "var(--gray-4)",
  fillColor = "var(--blue-3)",
}) => (
  <svg
    // width="2rem"
    // height="2rem"
    viewBox="0 0 150 150"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="Output">
      {operation === "common" && (
        <g id="Fills_Common">
          <path
            id="Subtract"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.68911 75C15.3343 89.945 31.4929 100 50 100C50 118.507 60.055 134.666 75 143.311C89.945 134.666 100 118.507 100 100C118.507 100 134.666 89.945 143.311 75C134.666 60.055 118.507 50 100 50C100 31.4929 89.945 15.3343 75 6.68911C60.055 15.3343 50 31.4929 50 50C31.4929 50 15.3343 60.055 6.68911 75Z"
            fill={fillColor}
          />
        </g>
      )}
      {operation === "unique" && (
        <g id="Fills_Unique">
          <path
            id="Subtract 4"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M75 143.311C89.945 134.666 100 118.507 100 100C118.507 100 134.666 89.945 143.311 75C147.565 82.3543 150 90.8928 150 100C150 127.614 127.614 150 100 150C90.8928 150 82.3543 147.565 75 143.311Z"
            fill={fillColor}
          />
          <path
            id="Subtract 3"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.68911 75C15.3343 89.945 31.4929 100 50 100C50 118.507 60.055 134.666 75 143.311C67.6457 147.565 59.1072 150 50 150C22.3858 150 0 127.614 0 100C0 90.8928 2.43486 82.3543 6.68911 75Z"
            fill={fillColor}
          />
          <path
            id="Subtract 2"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M143.311 75C134.666 60.055 118.507 50 100 50C100 31.4929 89.945 15.3343 75 6.68911C82.3543 2.43486 90.8928 2.46208e-06 100 3.25826e-06C127.614 5.67237e-06 150 22.3858 150 50C150 59.1072 147.565 67.6457 143.311 75Z"
            fill={fillColor}
          />
          <path
            id="Subtract 1"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M75 6.68911C60.055 15.3343 50 31.4929 50 50C31.4929 50 15.3343 60.055 6.68911 75C2.43486 67.6457 0 59.1072 0 50C0 22.3858 22.3858 0 50 0C59.1072 0 67.6457 2.43486 75 6.68911Z"
            fill={fillColor}
          />
        </g>
      )}
      {operation === "intersection" && (
        <g id="Fills_Intersection">
          <path
            id="Intersect"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M75 93.3109C82.5907 88.9199 88.9199 82.5907 93.3109 75C88.9199 67.4093 82.5907 61.0801 75 56.6891C67.4093 61.0801 61.0801 67.4093 56.6891 75C61.0801 82.5907 67.4093 88.9199 75 93.3109Z"
            fill={fillColor}
          />
        </g>
      )}
      <g id="Outlines">
        <circle
          id="Ellipse 1"
          cx="50"
          cy="50"
          r="47.5"
          stroke={strokeColor}
          strokeWidth="5"
        />
        <circle
          id="Ellipse 2"
          cx="100"
          cy="50"
          r="47.5"
          stroke={strokeColor}
          strokeWidth="5"
        />
        <circle
          id="Ellipse 3"
          cx="50"
          cy="100"
          r="47.5"
          stroke={strokeColor}
          strokeWidth="5"
        />
        <circle
          id="Ellipse 4"
          cx="100"
          cy="100"
          r="47.5"
          stroke={strokeColor}
          strokeWidth="5"
        />
      </g>
    </g>
  </svg>
);
export default VennDiagram;
