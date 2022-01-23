export const splitFilter = <ItemType>(
  array: ItemType[],
  predicate: (item: ItemType, index: number, array: ItemType[]) => any
) => {
  const result = { true: new Array<ItemType>(), false: new Array<ItemType>() };
  array.forEach((item, index, array) =>
    predicate(item, index, array)
      ? result.true.push(item)
      : result.false.push(item)
  );
  return result;
};

export const getCount = <ItemType>(
  array: ItemType[],
  predicate: (item: ItemType, index: number, array: ItemType[]) => any
) => {
  let count = 0;
  array.forEach((item, index, array) => {
    if (predicate(item, index, array)) count += 1;
  });
  return count;
};
