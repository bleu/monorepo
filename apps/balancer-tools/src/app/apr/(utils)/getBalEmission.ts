interface BalEmissions {
  year: number;
  weekly: number;
  total_supply: number;
}

export const getBalEmissions = (year: number): BalEmissions => {
  const halvingFactor = Math.pow(2, 1 / 4);

  const balPerYear: { [key: number]: number } = { 2022: 7560714 };
  const balEmissions: { [key: number]: number } = { 2022: 48980000 };
  const balWeeklyEmissions: { [key: number]: number } = { 2022: 145000 };

  for (let i = 1; i <= year - 2022; i++) {
    const currentYear = 2022 + i;
    balPerYear[currentYear] = balPerYear[currentYear - 1] / halvingFactor;
    balEmissions[currentYear] = balPerYear[currentYear - 1] + balEmissions[currentYear - 1];
    balWeeklyEmissions[currentYear] = balWeeklyEmissions[currentYear - 1] / halvingFactor;
  }

  return {
    year: balPerYear[year],
    weekly: balWeeklyEmissions[year],
    total_supply: balEmissions[year]
  };
};
