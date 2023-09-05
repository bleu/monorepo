export function formatTVL(tvl: number) {
  return `
    $
    ${tvl.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}
    `;
}

export function formatAPR(apr: number) {
  if (apr === 0) {
    return "N/A";
  }
  return `
    ${apr.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
    %`;
}
