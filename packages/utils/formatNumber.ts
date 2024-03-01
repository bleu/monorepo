type Notation = "compact" | "engineering" | "scientific" | "standard";

export const formatNumber = (
  number: number | string | bigint,
  decimals = 1,
  style = "decimal",
  notation: Notation = "compact",
  lessThanThresholdToReplace = 0.001,
) => {
  if (number == 0) return "0";
  if (Number.isNaN(number)) return "-";
  if (Math.abs(Number(number)) < lessThanThresholdToReplace) {
    return `< ${lessThanThresholdToReplace.toLocaleString("en-US")}`;
  }

  return Number(number).toLocaleString("en-US", {
    notation,
    maximumFractionDigits: decimals,
    style,
  });
};

export function numberToPercent(value?: number) {
  if (!value) return undefined;
  return value * 100;
}

export function percentToNumber(value: number) {
  return value / 100;
}
