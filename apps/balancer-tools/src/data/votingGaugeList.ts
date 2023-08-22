import votingGauges from "#/data/voting-gauges.json";
import { Pool } from "#/lib/balancer/gauges";

interface DataObject {
  address: string;
  network: number;
  isKilled?: boolean;
  addedTimestamp: number;
  relativeWeightCap: string;
  pool: Pool;
  tokenLogoURIs: { [key: string]: string };
}

interface NetworkToPoolMap {
  [network: number]: string[];
}

function mapNetworkToPoolIds(data: DataObject[]): NetworkToPoolMap {
  const resultMap: NetworkToPoolMap = {};

  data.forEach((item) => {
    if (resultMap[item.network]) {
      resultMap[item.network].push(item.pool.id);
    } else {
      resultMap[item.network] = [item.pool.id];
    }
  });

  return resultMap;
}

export const votingGaugeList = mapNetworkToPoolIds(
  votingGauges as unknown as DataObject[],
);
