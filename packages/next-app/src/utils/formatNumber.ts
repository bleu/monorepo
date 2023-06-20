const formatNumber = (
  number: number | string | bigint,
  decimals = 1,
  style = "decimal"
): string => {
  return Number(number).toLocaleString("en-US", {
    notation: "compact",
    maximumFractionDigits: decimals,
    style,
  });
};

export default formatNumber;
