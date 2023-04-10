import { Network } from "@balancer-pool-metadata/shared";

import { getSdk as arbitrumSdk } from "./__generated__/Arbitrum.server";
import { getSdk as goerliSdk } from "./__generated__/Goerli.server";
import { getSdk as mainnetSdk } from "./__generated__/Mainnet.server";
import { getSdk as polygonSdk } from "./__generated__/Polygon.server";

export default {
  [Network.Mainnet]: mainnetSdk,
  [Network.Polygon]: polygonSdk,
  [Network.Arbitrum]: arbitrumSdk,
  [Network.Goerli]: goerliSdk,
};
