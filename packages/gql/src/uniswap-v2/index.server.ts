import { Network } from "@bleu/utils";

import { getSdk as ethereumSdk } from "./__generated__/Ethereum.server";

export default {
  [Network.Ethereum]: ethereumSdk,
};
