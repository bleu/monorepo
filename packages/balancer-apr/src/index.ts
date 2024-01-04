/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-env node */
// eslint-disable-next-line @typescript-eslint/no-var-requires
import "dotenv/config";

import { sql } from "drizzle-orm";

import { calculatePoolRewardsSnapshots } from "./calculatePoolRewardsSnapshots";
import { calculateTokenWeightSnapshots } from "./calculateTokenWeightSnapshots";
import { chunks } from "./chunks";
import {
  NETWORK_TO_BALANCER_ENDPOINT_MAP,
  NETWORK_TO_REWARDS_ENDPOINT_MAP,
} from "./config";
import { db } from "./db/index";
import { fetchTokenPrices } from "./fetchTokenPrices";
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
import { loadAPRs } from "./lib/etl/load/loadAPRs";
import { loadBalEmission } from "./lib/etl/load/loadBalEmission";
import { loadCalendar } from "./lib/etl/load/loadCalendar";
import { loadNetworks } from "./lib/etl/load/loadNetworks";
import { loadVebalRounds } from "./lib/etl/load/loadVebalRounds";
import { transformPools } from "./lib/etl/transform/transformPools";
import { transformPoolSnapshots } from "./lib/etl/transform/transformPoolSnapshots";
import { transformRewardsData } from "./lib/etl/transform/transformRewardsData";

export const BATCH_SIZE = 1_000;
export const BALANCER_START_DATE = "2021-04-21";

const isVerbose = process.argv.includes("-v");

export function logIfVerbose(message: unknown) {
  if (isVerbose) {
    console.log(message);
  }
}

export async function addToTable(
  table: any,
  items: any,
  onConflictStatement: any = null
) {
  const chunkedItems = [...chunks(items, BATCH_SIZE)];
  return await Promise.all(
    chunkedItems.map(async (items) => {
      return onConflictStatement
        ? await db
            .insert(table)
            .values(items)
            .onConflictDoUpdate(onConflictStatement)
        : await db.insert(table).values(items).onConflictDoNothing();
    })
  );
}

export const networkNames = Object.keys(
  NETWORK_TO_BALANCER_ENDPOINT_MAP
) as (keyof typeof NETWORK_TO_BALANCER_ENDPOINT_MAP)[];

export const networkNamesRewards = Object.keys(
  NETWORK_TO_REWARDS_ENDPOINT_MAP
) as (keyof typeof NETWORK_TO_REWARDS_ENDPOINT_MAP)[];

export async function removeLiquidityBootstraping() {
  return await db.execute(sql`
  DELETE FROM pools
  WHERE pool_type = 'LiquidityBootstrapping' OR pool_type = NULL;
  `);
}

export async function runETLs() {
  logIfVerbose("Starting ETL processes");

  await Promise.all([loadCalendar(), loadNetworks()]);

  await Promise.all([loadVebalRounds(), loadBalEmission()]);

  await Promise.all([
    extractBlocks(),
    extractPools(),
    extractPoolSnapshots(),
    extractPoolRewards(),
  ]);

  await Promise.all([
    extractGauges(),
    extractPoolRateProviders(),
    fetchBalPrices(),
    extractTokenDecimals(),
  ]);

  await transformPools();
  await transformPoolSnapshots();

  await Promise.all([fetchTokenPrices(), extractGaugesSnapshot()]);

  await removeLiquidityBootstraping();
  await transformRewardsData();

  await extractPoolRateProviderSnapshots();
  await calculateTokenWeightSnapshots();

  await calculatePoolRewardsSnapshots();

  await loadAPRs();
  logIfVerbose("Ended ETL processes");
  process.exit(0);
}

runETLs();
