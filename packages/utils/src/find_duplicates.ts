export const findDuplicates = <T>(input: T[]) => {
  const sorted = input.slice().sort();
  const results: T[] = [];

  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i + 1] == sorted[i]) {
      results.push(sorted[i]);
    }
  }

  return results;
};
