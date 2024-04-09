/* eslint-disable no-console */
export const measureAsync = async <T>(
  callableAsync: () => Promise<T>
): Promise<T> => {
  console.time('event');

  const result = await callableAsync();

  console.timeEnd('event');

  return result;
};
