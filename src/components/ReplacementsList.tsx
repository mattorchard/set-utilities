import React from "react";
import Box from "./Box";
import Typo from "./Typo";
import "./ReplacementsList.css";
import TallTextArea from "./TallTextArea";
import ExpandingRemoveButton from "./ExpandingRemoveButton";

interface ReplacementsListProps {
  replacements: RunReplacement[];
  onReplacementsChange: (replacements: RunReplacement[]) => void;
}

const ReplacementsList: React.FC<ReplacementsListProps> = ({
  replacements,
  onReplacementsChange,
}) => {
  const handleRemoveReplacement = (idToRemove: string) =>
    onReplacementsChange(replacements.filter((r) => r.id !== idToRemove));

  const updateReplacement = (id: string, text: string) =>
    onReplacementsChange(
      replacements.map((r) => (r.id === id ? { ...r, replacement: text } : r))
    );

  return (
    <ul className="non-list">
      {replacements.map((replacement) => (
        <Box
          key={replacement.id}
          as="li"
          flexDirection="column"
          className="replacements-list__item illuminate"
        >
          <Box ml="auto">
            <ExpandingRemoveButton
              onClick={() => handleRemoveReplacement(replacement.id)}
            />
          </Box>

          <Typo as="pre" monospace className="replacements-list__item__old">
            {replacement.results[0].preview}
          </Typo>
          <TallTextArea
            defaultValue={
              replacement.replacement || replacement.results[0].preview
            }
            aria-label="Replacement text"
            fill
            placeholder="Replacement text"
            className="replacements-list__item__new"
            onBlur={(e) =>
              updateReplacement(replacement.id, e.currentTarget.value)
            }
          />
        </Box>
      ))}
    </ul>
  );
};

export default ReplacementsList;
