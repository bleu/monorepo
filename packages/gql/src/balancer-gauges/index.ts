import { Network } from "@balancer-pool-metadata/shared";

import { getSdkWithHooks as arbitrumSdk } from "./__generated__/Arbitrum";
import { getSdkWithHooks as goerliSdk } from "./__generated__/Goerli";
import { getSdkWithHooks as mainnetSdk } from "./__generated__/Mainnet";
import { getSdkWithHooks as polygonSdk } from "./__generated__/Polygon";
import { getSdkWithHooks as sepoliaSdk } from "./__generated__/Sepolia";

export default {
  [Network.Mainnet]: mainnetSdk,
  [Network.Polygon]: polygonSdk,
  [Network.Arbitrum]: arbitrumSdk,
  [Network.Goerli]: goerliSdk,
  [Network.Sepolia]: sepoliaSdk,
};
