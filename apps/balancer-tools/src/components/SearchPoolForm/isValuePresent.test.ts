import { isValuePresent } from "./isValuePresent";

describe("isValuePresent function", () => {
  const regex = /hello/;

  it("should return true for a matching string", () => {
    expect(isValuePresent("hello world", regex)).toBe(true);
  });

  it("should return false for a non-matching string", () => {
    expect(isValuePresent("goodbye world", regex)).toBe(false);
  });

  it("should return true for a matching string inside an array", () => {
    expect(isValuePresent(["goodbye world", "hello universe"], regex)).toBe(
      true,
    );
  });

  it("should return false for a non-matching string inside an array", () => {
    expect(isValuePresent(["goodbye world", "farewell universe"], regex)).toBe(
      false,
    );
  });

  it("should return true for a matching string inside an object", () => {
    expect(
      isValuePresent(
        { greeting1: "goodbye world", greeting2: "hello universe" },
        regex,
      ),
    ).toBe(true);
  });

  it("should return false for a non-matching string inside an object", () => {
    expect(
      isValuePresent(
        { greeting1: "goodbye world", greeting2: "farewell universe" },
        regex,
      ),
    ).toBe(false);
  });

  it("should return true for a matching string inside a nested object", () => {
    const nestedObj = {
      greeting1: "goodbye world",
      inner: {
        greeting2: "hello universe",
      },
    };
    expect(isValuePresent(nestedObj, regex)).toBe(true);
  });

  it("should return true for a matching string inside a nested array", () => {
    const nestedArray = ["goodbye world", ["farewell", "hello universe"]];
    expect(isValuePresent(nestedArray, regex)).toBe(true);
  });

  it("should return false for a non-matching string inside a nested structure", () => {
    const nestedStructure = {
      greeting1: "goodbye world",
      innerArray: ["farewell", "adios universe"],
      innerObj: {
        greeting2: "ciao world",
      },
    };
    expect(isValuePresent(nestedStructure, regex)).toBe(false);
  });
});
