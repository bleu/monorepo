export function isValuePresent(value: unknown, regex: RegExp): boolean {
  // Check if the value is a string and matches the regex
  if (typeof value === "string") {
    return regex.test(value);
  }

  // Recursively check if any of the array values match the regex
  if (Array.isArray(value)) {
    return value.some((item) => isValuePresent(item, regex));
  }

  // Recursively check if any of the object values match the regex
  if (typeof value === "object" && value !== null) {
    return Object.values(value).some((subValue) =>
      isValuePresent(subValue, regex),
    );
  }

  return false;
}
