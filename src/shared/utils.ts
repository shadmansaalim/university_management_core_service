/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

// Helper function to iterate over an array and call a callback function passing array's item.
export const asyncForEach = async (
  array: any[],
  callback: any
): Promise<void> => {
  if (!Array.isArray(array)) {
    throw new Error('Expected an array.');
  }
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};
