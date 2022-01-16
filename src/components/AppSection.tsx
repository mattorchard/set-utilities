import React, { useState } from "react";
import Box from "./Box";
import CircleDot from "./CircleDot";
import { Button, Icon, Tooltip } from "@blueprintjs/core";
import "./AppSection.css";
import { duringAnimation } from "../helpers/animationHelpers";

interface AppSectionProps {
  stepNumber: number;
  heading: string;
  isExpandEnabled?: boolean;
}

const AppSection: React.FC<AppSectionProps> = ({
  stepNumber,
  heading,
  children,
  isExpandEnabled = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = (event: React.MouseEvent<HTMLElement>) => {
    setIsExpanded((e) => !e);
    const scrollContainer = event.currentTarget.closest(".app__form")!;
    duringAnimation(
      500,
      () => (scrollContainer.scrollLeft = window.innerWidth)
    );
  };

  return (
    <section className={`app-section ${isExpanded && "app-section--expanded"}`}>
      <Box as="header" alignItems="center" mb={8}>
        <Box mr={8}>
          <CircleDot>{stepNumber}</CircleDot>
        </Box>
        <Box as="h2" className="bp4-heading" m={0} mr="auto">
          {heading}
        </Box>
        {isExpandEnabled && (
          <Tooltip content="Expand section">
            <Button
              aria-label="Expand section"
              minimal
              large
              onClick={handleToggleExpand}
            >
              <Icon icon="arrows-horizontal" size={24} />
            </Button>
          </Tooltip>
        )}
      </Box>

      {children}
    </section>
  );
};

export default AppSection;
