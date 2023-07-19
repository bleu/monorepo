import { describe, expect, test } from "@jest/globals";

import parseFixed from "./parseFixed";

describe("parseFixed", () => {
  test("should handle whole numbers", () => {
    expect(parseFixed("1", 0).toString()).toEqual("1");
    expect(parseFixed("12345678901234567890", 0).toString()).toEqual(
      "12345678901234567890",
    );
    expect(
      parseFixed("1234567890123456789012345678901234567890", 0).toString(),
    ).toEqual("1234567890123456789012345678901234567890");
  });

  test("should handle negative whole numbers", () => {
    expect(parseFixed("-1", 0).toString()).toEqual("-1");
    expect(parseFixed("-12345678901234567890", 0).toString()).toEqual(
      "-12345678901234567890",
    );
    expect(
      parseFixed("-1234567890123456789012345678901234567890", 0).toString(),
    ).toEqual("-1234567890123456789012345678901234567890");
  });

  test("should handle fractional numbers", () => {
    expect(parseFixed("1.23", 2).toString()).toEqual("123");
    expect(parseFixed("0.001", 3).toString()).toEqual("1");
    expect(parseFixed("1.000000000000000001", 18).toString()).toEqual(
      "1000000000000000001",
    );
    expect(
      parseFixed("12345678901234567890.12345678901234567890", 20).toString(),
    ).toEqual("1234567890123456789012345678901234567890");
  });

  test("should handle negative fractional numbers", () => {
    expect(parseFixed("-1.23", 2).toString()).toEqual("-123");
    expect(parseFixed("-0.001", 3).toString()).toEqual("-1");
    expect(parseFixed("-1.000000000000000001", 18).toString()).toEqual(
      "-1000000000000000001",
    );
    expect(
      parseFixed("-12345678901234567890.12345678901234567890", 20).toString(),
    ).toEqual("-1234567890123456789012345678901234567890");
  });

  test("should handle leading zeroes", () => {
    expect(parseFixed("01", 0).toString()).toEqual("1");
    expect(parseFixed("00123", 0).toString()).toEqual("123");
    expect(parseFixed("0.01", 2).toString()).toEqual("1");
    expect(parseFixed("0.00100", 5).toString()).toEqual("100");
  });

  test("should handle trailing zeroes", () => {
    expect(parseFixed("10", 0).toString()).toEqual("10");
    expect(parseFixed("12300", 0).toString()).toEqual("12300");
    expect(parseFixed("1.200", 3).toString()).toEqual("1200");
    expect(parseFixed("1.0000100", 7).toString()).toEqual("10000100");
  });

  test("should handle zero and negative zero", () => {
    expect(parseFixed("0", 0).toString()).toEqual("0");
    expect(parseFixed("-0", 0).toString()).toEqual("0");
    expect(parseFixed("0.0", 1).toString()).toEqual("0");
    expect(parseFixed("-0.0", 1).toString()).toEqual("0");
  });

  test("should throw for invalid input", () => {
    expect(() => parseFixed("abc", 2)).toThrow();
    expect(() => parseFixed("1.23.4", 2)).toThrow();
    expect(() => parseFixed(".", 2)).toThrow();
    expect(() => parseFixed("", 2)).toThrow();
    expect(() => parseFixed("-", 2)).toThrow();
    expect(() => parseFixed("1..", 2)).toThrow();
  });

  test("should throw for decimals out of range", () => {
    expect(() => parseFixed("1", 300)).toThrow();
    expect(() => parseFixed("1", -1)).toThrow();
    expect(() => parseFixed("1", NaN)).toThrow();
  });

  test("should handle large numbers", () => {
    const largeNumber = "1" + "0".repeat(100);
    expect(parseFixed(largeNumber, 0).toString()).toEqual(largeNumber);

    const largeDecimalNumber = "1." + "0".repeat(100);
    expect(parseFixed(largeDecimalNumber, 100).toString()).toEqual(largeNumber);

    const negativeLargeNumber = "-" + largeNumber;
    expect(parseFixed(negativeLargeNumber, 0).toString()).toEqual(
      negativeLargeNumber,
    );
  });
});
