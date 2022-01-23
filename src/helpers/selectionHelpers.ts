export const selectElement = (node: Node) => {
  const selection = getSelection();
  if (!selection) return;
  const range = new Range();
  range.selectNodeContents(node);
  selection.removeAllRanges();
  selection.addRange(range);
};

export const deselect = () => getSelection()?.removeAllRanges();
