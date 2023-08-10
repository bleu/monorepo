import { expect } from "@jest/globals";

export function verifyApproximateEquality(calculated: number, result: number) {
  expect(calculated / result).toBeCloseTo(1);
}
