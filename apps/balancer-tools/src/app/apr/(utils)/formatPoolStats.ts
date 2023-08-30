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
  return `
    ${apr.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
    %`;
}
