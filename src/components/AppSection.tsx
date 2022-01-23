import React, { useState } from "react";
import Box from "./Box";
import CircleDot from "./CircleDot";
import { Button, Icon } from "@blueprintjs/core";
import { Tooltip2 as Tooltip } from "@blueprintjs/popover2";
import "./AppSection.css";
import { duringAnimation } from "../helpers/animationHelpers";

interface AppSectionProps {
  stepNumber: number;
  heading: string;
  isExpandEnabled?: boolean;
  scrollOffset?: number;
}

const AppSection: React.FC<AppSectionProps> = ({
  stepNumber,
  heading,
  children,
  isExpandEnabled = false,
  scrollOffset = 32,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = (event: React.MouseEvent<HTMLElement>) => {
    setIsExpanded((e) => !e);
    const scrollContainer = event.currentTarget.closest(
      "[data-scroll-container]"
    )!;
    const scrollAnchor = event.currentTarget.closest(
      "[data-scroll-anchor]"
    ) as HTMLElement;

    duringAnimation(
      500,
      () =>
        (scrollContainer.scrollLeft = scrollAnchor.offsetLeft - scrollOffset)
    );
  };

  return (
    <section
      className={`app-section ${isExpanded && "app-section--expanded"}`}
      data-scroll-anchor={true}
    >
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
              onClick={handleToggleExpand}
            >
              <Icon icon="arrows-horizontal" size={20} />
            </Button>
          </Tooltip>
        )}
      </Box>

      {children}
    </section>
  );
};

export default AppSection;
