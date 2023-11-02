import { Address } from "@bleu-fi/utils";
import { MinusIcon } from "@radix-ui/react-icons";
import { useAccount, useNetwork } from "wagmi";

import { Button } from "#/components";
import { LinkComponent } from "#/components/Link";
import { getNetwork } from "#/contexts/networks";
import { internalBalances } from "#/lib/gql";
import { refetchRequest } from "#/utils/refetchRequest";

export function BatchWithdrawButton() {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const network = getNetwork(chain?.name);

  const addressLower = address ? address?.toLowerCase() : "";
  const { data: internalBalanceData, mutate } = internalBalances
    .gql(chain?.id.toString() || "1")
    .useInternalBalance({
      userAddress: addressLower as Address,
    });

  refetchRequest({
    mutate,
    chainId: chain?.id.toString() || "1",
    userAddress: addressLower as Address,
  });

  const hasTokenWithBalance =
    !!internalBalanceData?.user?.userInternalBalances?.length &&
    internalBalanceData?.user?.userInternalBalances?.length > 0;
  return (
    <LinkComponent
      href={`/internalmanager/${network}/withdraw/all`}
      content={
        <Button
          className="flex items-center gap-1"
          shade="light"
          variant="outline"
          title="Withdraw all"
          disabled={!hasTokenWithBalance}
        >
          <MinusIcon />
          Batch Withdraw
        </Button>
      }
    />
  );
}
