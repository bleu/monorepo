interface iData {
  x: number[] | string[];
  y: number[] | string[];
}

/**
 * Sorts data arrays by the values in the 'x' array.
 *
 * @param {Object} data - An object containing 'x' and 'y' arrays to be sorted.
 * @returns {Array} An array containing sorted 'x' and corresponding 'y' arrays.
 */
export default function sortDataByX(data: iData) {
  if (!Array.isArray(data.x) || !Array.isArray(data.y)) {
    throw new Error("'x' and 'y' properties should be arrays.");
  }

  const sortedIndices = data.x
    .map((_, index) => index)
    .sort((a, b) => {
      const xValueA = parseFloat(data.x[a] as string);
      const xValueB = parseFloat(data.x[b] as string);
      return xValueA - xValueB;
    });

  const sortedX: number[] | string[] = [];
  const sortedY: number[] | string[] = [];

  for (const index of sortedIndices) {
    sortedX.push(data.x[index]);
    sortedY.push(data.y[index]);
  }

  return [sortedX, sortedY];
}
