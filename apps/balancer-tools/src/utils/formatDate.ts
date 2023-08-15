/**
 * Formats a date in the "MM/DD/YYYY" (American) format.
 *
 * @param {Date} date - The input date to be formatted.
 * @returns {string} A string representing the formatted date.
 */
export function formatDateToAmerican(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}
