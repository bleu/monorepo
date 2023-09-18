import {
  computeSwapAmounts,
  findTransitions,
  getBetaLimits,
  getTransitionIndices,
  isInBetaRegion,
} from "./getBetaLimits";

describe("Token Functions", () => {
  test("computeSwapAmounts", () => {
    const result = computeSwapAmounts([-5, -10], [10, 20]);
    expect(result).toEqual([-10, -5, 10, 20]);
  });

  test("isInBetaRegion", () => {
    expect(isInBetaRegion(10, 15, 0.1)).toBeFalsy();
    expect(isInBetaRegion(10, 15, 0.3)).toBeTruthy();
  });

  describe("getTransitionIndices", () => {
    test("Should return indices of continuous true values", () => {
      expect(
        getTransitionIndices([false, false, true, true, true, false]),
      ).toEqual([2, 5]);
    });

    test("Should throw an error for non-continuous true values", () => {
      expect(() =>
        getTransitionIndices([false, false, true, false, true, true]),
      ).toThrow("The true values are not continuous.");
    });

    test("Should return an empty array for no true values", () => {
      expect(getTransitionIndices([false, false, false, false])).toEqual([]);
    });

    test("Should handle true values at the start and end", () => {
      expect(getTransitionIndices([true, true, false, false])).toEqual([0, 2]);
      expect(getTransitionIndices([false, false, true, true])).toEqual([2, 3]);
    });
  });
  describe("findTransitions", () => {
    test("Should find transitions where balances enter beta region", () => {
      const analysisAmounts = [10, 20, 30, 40];
      const tabAmounts = [12, 23, 32, 43];
      const beta = 0.05;
      expect(findTransitions(analysisAmounts, tabAmounts, beta)).toEqual([
        2, 3,
      ]);
    });
  });

  describe("getBetaLimits", () => {
    test("Should return correct swap amounts for beta region", () => {
      const result = getBetaLimits({
        analysisTokenOut: [0, -5, -10, -15],
        analysisTokenIn: [0, 5, 10, 15],
        analysisTokenRate: 1,
        tabTokenRate: 1,
        pairTokenIn: [0, 5, 10, 15],
        pairTokenOut: [0, -5, -10, -15],
        analysisTokenInitialBalance: 120,
        tabTokenInitialBalance: 120,
        beta: 0.05,
      });
      expect(result).toEqual({
        analysis: [-5, 10],
        analysisTokenIn: { analysisAmount: 10, tabAmount: -10 },
        pair: [5, -10],
        tabTokenIn: { analysisAmount: -5, tabAmount: 5 },
      });
    });
  });
});
