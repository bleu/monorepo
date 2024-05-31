import { Network } from "@bleu/utils";

import { getSdkWithHooks as ethereumSdk } from "./__generated__/Ethereum";
import { getSdkWithHooks as gnosisSdk } from "./__generated__/Gnosis";

export default {
  [Network.Ethereum]: ethereumSdk,
  [Network.Gnosis]: gnosisSdk,
};
