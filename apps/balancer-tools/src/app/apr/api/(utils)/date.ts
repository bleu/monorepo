export const SECONDS_IN_DAY = 86400;
export const DAYS_IN_YEAR = 365;
export const SECONDS_IN_YEAR = DAYS_IN_YEAR * SECONDS_IN_DAY;

export function formatDateToMMDDYYYY(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${month}-${day}-${year}`;
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
