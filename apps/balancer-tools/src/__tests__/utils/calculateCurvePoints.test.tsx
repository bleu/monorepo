import { calculateCurvePoints } from "#/app/poolsimulator/(utils)";

describe("calculateCurvePoints", () => {
  it("should return an array of calculated points with a given balance and start", () => {
    const balance = 1000;
    const start = 10;
    const result = calculateCurvePoints({ balance, start });

    expect(result.length).toBe(121);

    expect(result[0]).toBe(start);
  });

  it("should return an empty array when balance is not provided", () => {
    const result = calculateCurvePoints({});
    expect(result).toEqual([]);
  });

  it("should return first item as 0 when start is not defined", () => {
    const result = calculateCurvePoints({ balance: 1000 });
    expect(result[0]).toBe(0);
  });

  it("should handle negative start value", () => {
    const balance = 1000;
    const start = -10;
    const result = calculateCurvePoints({ balance, start });

    expect(result.length).toBe(121);
    expect(result[0]).toBe(start);
  });

  it("should generate points that follow the expected curve", () => {
    const balance = 1000;
    const start = 10;
    const result = calculateCurvePoints({ balance, start });
    const initialValue = balance * 0.001;
    const stepRatio = Math.pow(balance / initialValue, 1 / 99);

    result.slice(1).forEach((value, index) => {
      expect(value).toBeCloseTo(initialValue * stepRatio ** index);
    });
  });
});
