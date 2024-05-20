/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-env node */
// eslint-disable-next-line @typescript-eslint/no-var-requires
import "dotenv/config";

import { sql } from "drizzle-orm";

import { db } from "./db/index";
import {
  NETWORK_TO_BALANCER_ENDPOINT_MAP,
  NETWORK_TO_REWARDS_ENDPOINT_MAP,
} from "./lib/config";
import { extractBlocks } from "./lib/etl/extract/extractBlocks";
import { extractGauges } from "./lib/etl/extract/extractGauges";
import { extractGaugesSnapshot } from "./lib/etl/extract/extractGaugesSnapshot";
import { extractPoolRateProviders } from "./lib/etl/extract/extractPoolRateProviders";
import { extractPoolRateProviderSnapshots } from "./lib/etl/extract/extractPoolRateProviderSnapshots";
import { extractPoolRewards } from "./lib/etl/extract/extractPoolRewards";
import { extractPools } from "./lib/etl/extract/extractPools";
import { extractPoolSnapshots } from "./lib/etl/extract/extractPoolSnapshots";
import { extractTokenDecimals } from "./lib/etl/extract/extractTokenDecimals";
import { fetchBalPrices } from "./lib/etl/extract/fetchBalPrices";
import { fetchTokenPrices } from "./lib/etl/extract/fetchTokenPrices";
import { calculatePoolRewardsSnapshots } from "./lib/etl/load/calculatePoolRewardsSnapshots";
import { calculateTokenWeightSnapshots } from "./lib/etl/load/calculateTokenWeightSnapshots";
import { loadAPRs } from "./lib/etl/load/loadAPRs";
import { loadBalEmission } from "./lib/etl/load/loadBalEmission";
import { loadCalendar } from "./lib/etl/load/loadCalendar";
import { loadNetworks } from "./lib/etl/load/loadNetworks";
import { loadVebalRounds } from "./lib/etl/load/loadVebalRounds";
import { transformPools } from "./lib/etl/transform/transformPools";
import { transformPoolSnapshots } from "./lib/etl/transform/transformPoolSnapshots";
import { transformRewardsData } from "./lib/etl/transform/transformRewardsData";
import { logIfVerbose } from "./lib/logIfVerbose";

export const BALANCER_START_DATE = "2021-04-21";

export const networkNames = Object.keys(
  NETWORK_TO_BALANCER_ENDPOINT_MAP,
) as (keyof typeof NETWORK_TO_BALANCER_ENDPOINT_MAP)[];

export const networkNamesRewards = Object.keys(
  NETWORK_TO_REWARDS_ENDPOINT_MAP,
) as (keyof typeof NETWORK_TO_REWARDS_ENDPOINT_MAP)[];

export async function removeLiquidityBootstraping() {
  return await db.execute(sql`
  DELETE FROM pools
  WHERE pool_type = 'LiquidityBootstrapping' OR pool_type = NULL;
  `);
}

export async function runETLs() {
  logIfVerbose("Starting ETL processes");

  await loadCalendar();
  await loadNetworks();

  await loadVebalRounds();
  await loadBalEmission();

  await extractBlocks();
  await extractPools();
  await extractPoolSnapshots();
  await extractPoolRewards();

  await extractGauges();
  await extractPoolRateProviders();
  await fetchBalPrices();
  await extractTokenDecimals();

  await transformPools();

  await transformPoolSnapshots();

  await fetchTokenPrices();
  await extractGaugesSnapshot();

  await removeLiquidityBootstraping(); // TODO remove also from pool_snapshots and pool_snapshots_temp and pool_rewards
  await transformRewardsData();

  await extractPoolRateProviderSnapshots();
  await calculateTokenWeightSnapshots();

  await calculatePoolRewardsSnapshots();

  await loadAPRs();
  logIfVerbose("Ended ETL processes");
  process.exit(0);
}

runETLs();
