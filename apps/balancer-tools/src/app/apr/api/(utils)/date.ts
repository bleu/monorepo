const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;
const MILLISECONDS_IN_A_WEEK = 7 * MILLISECONDS_IN_DAY;

export function formatDateToMMDDYYYY(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${month}-${day}-${year}`;
}

export const generateDateRange = (startDate: Date, endDate: Date) => {
  const dateRange = [];

  for (
    let currentDate = startDate;
    currentDate <= endDate;
    currentDate = new Date(currentDate.getTime() + MILLISECONDS_IN_DAY)
  ) {
    dateRange.push(currentDate);
  }

  return dateRange;
};

/**
 * Calculates the number of days between two dates, inclusive of both start and end dates.
 */
export const calculateDaysBetween = (startDate: number, endDate: number) =>
  Math.floor((endDate - startDate) / MILLISECONDS_IN_DAY) + 1;

export function getWeeksBetweenDates(
  startDateTimestamp: number,
  endDateTimestamp: number,
) {
  const timeDifferenceInMilliseconds = Math.abs(
    startDateTimestamp - endDateTimestamp,
  );
  // Calculate the number of weeks apart
  return Math.floor(timeDifferenceInMilliseconds / MILLISECONDS_IN_A_WEEK);
}
