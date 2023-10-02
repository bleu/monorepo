/**
 * IMPORTED FROM BALANCER-SDK
 * https://github.com/balancer/balancer-sdk/blob/379883359a0dead100282158f7aa2d13c255a7a3/balancer-js/src/modules/data/bal/emissions.ts
 * We decided to import this code instead of using the balancer-sdk because
 * the balancer-sdk would force us to install ethers.js
 *
 * Weekly Bal emissions are fixed / year according to:
 * https://docs.google.com/spreadsheets/d/1FY0gi596YWBOTeu_mrxhWcdF74SwKMNhmu0qJVgs0KI/edit#gid=0
 *
 * Using regular numbers for simplicity assuming frontend use only.
 *
 * Calculation source
 * https://github.com/balancer-labs/balancer-v2-monorepo/blob/master/pkg/liquidity-mining/contracts/BalancerTokenAdmin.sol
 */

import { dateToEpoch, SECONDS_IN_YEAR } from "#/app/apr/api/(utils)/date";

export const INITIAL_RATE = 145000;
export const START_EPOCH_TIME = 1648465251;
const RATE_REDUCTION_TIME = SECONDS_IN_YEAR;
const RATE_REDUCTION_COEFFICIENT = 2 ** (1 / 4);

/**
 * Weekly BAL emissions
 *
 * @param currentTimestamp used to get the epoch
 * @returns BAL emitted in a week
 */
export const weekly = (
  currentTimestamp: number = dateToEpoch(new Date()),
): number => {
  const miningEpoch = Math.floor(
    (currentTimestamp - START_EPOCH_TIME) / RATE_REDUCTION_TIME,
  );

  const rate = INITIAL_RATE * RATE_REDUCTION_COEFFICIENT ** -miningEpoch;

  return rate;
};

/**
 * Total BAL emitted in epoch (1 year)
 *
 * @param epoch starting from 0 for the first year of emissions
 * @returns BAL emitted in epoch
 */
export const total = (epoch: number): number => {
  const weeklyRate = INITIAL_RATE * RATE_REDUCTION_COEFFICIENT ** -epoch;
  const dailyRate = weeklyRate / 7;

  return dailyRate * 365;
};

/**
 * Total BAL emitted between two timestamps
 *
 * @param start starting timestamp
 * @param end ending timestamp
 * @returns BAL emitted in period
 */
export const between = (start: number, end: number): number => {
  if (start < START_EPOCH_TIME) {
    throw "start timestamp before emission schedule deployment";
  }
  if (end < start) {
    throw "cannot finish before starting";
  }

  let totalEmissions = 0;

  const startingEpoch = Math.floor(
    (start - START_EPOCH_TIME) / RATE_REDUCTION_TIME,
  );
  const endingEpoch = Math.floor(
    (end - START_EPOCH_TIME) / RATE_REDUCTION_TIME,
  );

  for (
    let currentEpoch = startingEpoch;
    currentEpoch <= endingEpoch;
    currentEpoch++
  ) {
    totalEmissions += total(currentEpoch);
  }

  // Subtract what isn't emmited within the time range
  const startingEpochEnd =
    START_EPOCH_TIME + RATE_REDUCTION_TIME * (startingEpoch + 1);
  const endingEpochStart = START_EPOCH_TIME + RATE_REDUCTION_TIME * endingEpoch;

  const secondsInStartingEpoch = startingEpochEnd - start;
  const secondsInEndingEpoch = end - endingEpochStart;

  totalEmissions -=
    (total(startingEpoch) * (RATE_REDUCTION_TIME - secondsInStartingEpoch)) /
    RATE_REDUCTION_TIME;
  totalEmissions -=
    (total(endingEpoch) * (RATE_REDUCTION_TIME - secondsInEndingEpoch)) /
    RATE_REDUCTION_TIME;

  return totalEmissions;
};
