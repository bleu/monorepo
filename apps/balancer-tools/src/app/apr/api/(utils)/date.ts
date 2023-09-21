export function formatDateToMMDDYYYY(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${month}-${day}-${year}`;
}

export const generateDateRange = (startDate: Date, endDate: Date) => {
  const dayMilliseconds = 24 * 60 * 60 * 1000;
  const dateRange = [];

  for (
    let currentDate = startDate;
    currentDate <= endDate;
    currentDate = new Date(currentDate.getTime() + dayMilliseconds)
  ) {
    dateRange.push(currentDate);
  }

  return dateRange;
};
