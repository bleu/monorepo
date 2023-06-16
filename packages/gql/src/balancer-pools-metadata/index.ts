import { Network } from "@bleu-balancer-tools/shared";

import { getSdkWithHooks as arbitrumSdk } from "./__generated__/Arbitrum";
import { getSdkWithHooks as ethereumSdk } from "./__generated__/Ethereum";
import { getSdkWithHooks as gnosisSdk } from "./__generated__/Gnosis";
import { getSdkWithHooks as goerliSdk } from "./__generated__/Goerli";
import { getSdkWithHooks as optimismSdk } from "./__generated__/Optimism";
import { getSdkWithHooks as polygonSdk } from "./__generated__/Polygon";
import { getSdkWithHooks as sepoliaSdk } from "./__generated__/Sepolia";

export default {
  [Network.Ethereum]: ethereumSdk,
  [Network.Polygon]: polygonSdk,
  [Network.Arbitrum]: arbitrumSdk,
  [Network.Gnosis]: gnosisSdk,
  [Network.Optimism]: optimismSdk,
  [Network.Goerli]: goerliSdk,
  [Network.Sepolia]: sepoliaSdk,
};
