import { Network } from "@bleu-fi/utils";

import { getSdk as ethereumSdk } from "./__generated__/Ethereum.server";

export default {
  [Network.Ethereum]: ethereumSdk,
};
