import { describe, expect, test } from "@jest/globals";

import { formatDate } from "./index";

describe("formatDate", () => {
  test("should format the date correctly", () => {
    const date = new Date("2023-08-15");
    const formattedDate = formatDate(date);
    expect(formattedDate).toMatch(/^[A-Za-z]{3} \d{2}, \d{4}$/);
  });

  test("should throw for invalid input", () => {
    expect(() => formatDate("invalid" as never)).toThrow();
    expect(() => formatDate(null as never)).toThrow();
    expect(() => formatDate(undefined as never)).toThrow();
  });

  test("should format different dates correctly", () => {
    const date1 = new Date("2023-01-05");
    const formattedDate1 = formatDate(date1);
    expect(formattedDate1).toBe("Jan 05, 2023");

    const date2 = new Date("1999-12-25");
    const formattedDate2 = formatDate(date2);
    expect(formattedDate2).toBe("Dec 25, 1999");
  });

  test("should format edge cases", () => {
    const date1 = new Date(0); // Unix epoch
    const formattedDate1 = formatDate(date1);
    expect(formattedDate1).toBe("Jan 01, 1970");

    const date2 = new Date("9999-12-31");
    const formattedDate2 = formatDate(date2);
    expect(formattedDate2).toBe("Dec 31, 9999");
  });

  test("should format dates with single-digit days and months", () => {
    const date1 = new Date("2023-02-03");
    const formattedDate1 = formatDate(date1);
    expect(formattedDate1).toBe("Feb 03, 2023");

    const date2 = new Date("2023-09-07");
    const formattedDate2 = formatDate(date2);
    expect(formattedDate2).toBe("Sep 07, 2023");
  });
});
