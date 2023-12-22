import { tokenPrices } from "../../../db/schema";
import { fetchTokenPrice } from "../../../fetchTokenPrices";
import { addToTable, BALANCER_START_DATE, logIfVerbose } from "../../../index";

export async function fetchBalPrices() {
  logIfVerbose("Start fetching BAL prices process");
  const prices = await fetchTokenPrice(
    "ethereum",
    "0xba100000625a3754423978a60c9317c58a424e3d",
    new Date(BALANCER_START_DATE),
  );

  await addToTable(tokenPrices, prices);
}
