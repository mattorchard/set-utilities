import React, { useRef, useState } from "react";
import Box from "./Box";
import CircleDot from "./CircleDot";
import { Button, Icon } from "@blueprintjs/core";
import { Tooltip2 as Tooltip } from "@blueprintjs/popover2";
import "./AppSection.css";

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
}) => {
  const ref = useRef<HTMLElement>(undefined!);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = () => {
    setIsExpanded((e) => !e);
  };

  const actionLabel = isExpanded ? "Shrink section" : "Expand section";

  return (
    <section
      ref={ref}
      className={`app-section ${isExpanded && "app-section--expanded"}`}
      data-scroll-anchor={true}
      onTransitionEnd={(event) => {
        if (event.target === event.currentTarget) {
          setTimeout(() => {
            ref.current?.scrollIntoView({
              behavior: "smooth",
              inline: "start",
            });
          }, 300);
        }
      }}
    >
      <Box as="header" alignItems="center" mb={8}>
        <Box mr={8}>
          <CircleDot>{stepNumber}</CircleDot>
        </Box>
        <Box as="h2" className="bp4-heading" m={0} mr="auto">
          {heading}
        </Box>
        {isExpandEnabled && (
          <Tooltip content={actionLabel}>
            <Button
              aria-label={actionLabel}
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
