export const WEEKS_IN_YEAR = 52;
export const SECONDS_IN_DAY = 86400;
export const DAYS_IN_YEAR = 365;
export const SECONDS_IN_YEAR = DAYS_IN_YEAR * SECONDS_IN_DAY;

export function formatDateToMMDDYYYY(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${month}-${day}-${year}`;
}

export function parseMMDDYYYYToDate(
  dateStr: string | null | undefined,
): Date | null {
  if (!dateStr) return null;
  const [month, day, year] = dateStr.split("-").map(Number);
  if (
    !isNaN(month) &&
    !isNaN(day) &&
    !isNaN(year) &&
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= 31 &&
    year >= 1900 &&
    year <= new Date().getFullYear()
  ) {
    // Create a Date object in the expected format
    return new Date(
      `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}T00:00:00.000Z`,
    );
  }
  return null;
}

export const generateDateRange = (
  startTimestamp: number,
  endTimestamp: number,
) => {
  const dateRange = [];

  for (
    let currentTimestamp = startTimestamp;
    currentTimestamp <= endTimestamp;
    currentTimestamp += SECONDS_IN_DAY
  ) {
    dateRange.push(currentTimestamp);
  }

  return dateRange;
};

/**
 * Calculates the number of days between two dates, inclusive of both start and end dates.
 */
export const calculateDaysBetween = (
  startTimestamp: number,
  endTimestamp: number,
) => Math.floor((endTimestamp - startTimestamp) / SECONDS_IN_DAY) + 1;

export function getWeeksBetweenDates(
  startDateTimestamp: number,
  endDateTimestamp: number,
) {
  const timeDifferenceInSeconds = Math.abs(
    startDateTimestamp - endDateTimestamp,
  );
  // Calculate the number of weeks apart
  return Math.floor(timeDifferenceInSeconds / (7 * SECONDS_IN_DAY));
}

export const dateToEpoch = (date: Date): number =>
  Math.floor(date.getTime() / 1000);
