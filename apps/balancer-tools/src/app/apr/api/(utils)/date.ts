export function formatDateToMMDDYYYY(date: Date): string {
  return `${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}-${date.getFullYear()}`;
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
