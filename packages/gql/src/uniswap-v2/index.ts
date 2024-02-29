import { Network } from "@bleu-fi/utils";

import { getSdkWithHooks as ethereumSdk } from "./__generated__/Ethereum";

export default {
  [Network.Ethereum]: ethereumSdk,
};
