type ItemWithId = {
  id?: string;
};

export const getArrayItemIndex = <T extends ItemWithId>(
  itemId: string,
  array: T[]
): number => {
  return array.findIndex((item) => item.id === itemId);
};

export const getArrayItemById = <T extends ItemWithId>(
  itemId: string,
  array: T[]
): T | undefined => array.find((item) => item.id === itemId);

const updateItemInArray = <T extends ItemWithId>(
  index: number,
  array: T[],
  newItem: T
): T[] =>
  array.map((item, currentIndex) => {
    if (currentIndex !== index) {
      return item;
    }
    // May need to be careful if we wish to overwrite the item
    return {
      ...item,
      ...newItem,
    };
  });

/**
 * Add event
 * @param itemId
 * @param array
 * @param newItem
 */
export const upsertArrayItemById = <T extends ItemWithId>(
  itemId: string,
  array: T[],
  newItem: T
): T[] => {
  const itemIndex = getArrayItemIndex(itemId, array);

  // If not found => add it
  if (itemIndex < 0) {
    return [...array, newItem];
  }

  return updateItemInArray(itemIndex, array, newItem);
};
