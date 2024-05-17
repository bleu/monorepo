import { Network } from "@bleu-fi/utils";

import { getSdk as ethereumSdk } from "./__generated__/Ethereum.server";
import { getSdk as gnosisSdk } from "./__generated__/Gnosis.server";

export default {
  [Network.Ethereum]: ethereumSdk,
  [Network.Gnosis]: gnosisSdk,
};
