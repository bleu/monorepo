import { Network } from "@bleu/utils";

import { getSdkWithHooks as arbitrumSdk } from "./__generated__/Arbitrum";
import { getSdkWithHooks as avalancheSdk } from "./__generated__/Avalanche";
import { getSdkWithHooks as baseSdk } from "./__generated__/Base";
import { getSdkWithHooks as ethereumSdk } from "./__generated__/Ethereum";
import { getSdkWithHooks as gnosisSdk } from "./__generated__/Gnosis";
import { getSdkWithHooks as goerliSdk } from "./__generated__/Goerli";
import { getSdkWithHooks as optimismSdk } from "./__generated__/Optimism";
import { getSdkWithHooks as polygonSdk } from "./__generated__/Polygon";
import { getSdkWithHooks as polygonZkEVMSdk } from "./__generated__/Polygon-zkevm";
import { getSdkWithHooks as sepoliaSdk } from "./__generated__/Sepolia";

export default {
  [Network.Ethereum]: ethereumSdk,
  [Network.Polygon]: polygonSdk,
  [Network.Arbitrum]: arbitrumSdk,
  [Network.Gnosis]: gnosisSdk,
  [Network.Optimism]: optimismSdk,
  [Network.Goerli]: goerliSdk,
  [Network.Sepolia]: sepoliaSdk,
  [Network.PolygonZKEVM]: polygonZkEVMSdk,
  [Network.Base]: baseSdk,
  [Network.Avalanche]: avalancheSdk,
};
