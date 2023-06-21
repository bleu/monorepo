import { Network } from "@bleu-balancer-tools/shared";

import { getSdk as arbitrumSdk } from "./__generated__/Arbitrum.server";
import { getSdk as ethereumSdk } from "./__generated__/Ethereum.server";
import { getSdk as gnosisSdk } from "./__generated__/Gnosis.server";
import { getSdk as goerliSdk } from "./__generated__/Goerli.server";
import { getSdk as optimismSdk } from "./__generated__/Optimism.server";
import { getSdk as polygonSdk } from "./__generated__/Polygon.server";
import { getSdk as polygonZkEVMSdk } from "./__generated__/Polygonzkevm.server";
import { getSdk as sepoliaSdk } from "./__generated__/Sepolia.server";

export default {
  [Network.Ethereum]: ethereumSdk,
  [Network.Polygon]: polygonSdk,
  [Network.Arbitrum]: arbitrumSdk,
  [Network.Gnosis]: gnosisSdk,
  [Network.Optimism]: optimismSdk,
  [Network.Goerli]: goerliSdk,
  [Network.Sepolia]: sepoliaSdk,
  [Network.PolygonZKEVM]: polygonZkEVMSdk,
};
