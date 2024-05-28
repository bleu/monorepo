import { Address } from "@bleu/utils";
import { prepareWriteContract, writeContract } from "@wagmi/core";
import { parseUnits } from "viem";

import { SubmitData } from "#/hooks/useTransaction";
import { UserBalanceOpKind } from "#/lib/internal-balance-helper";

import { vaultABI, vaultAddress } from "./generated";

export async function writeManageUserBalance({
  data,
  operationKind,
  userAddress,
}: {
  data: SubmitData[];
  operationKind: UserBalanceOpKind | null;
  userAddress: Address;
}) {
  const userBalancesOp = data.map((transactionItem: SubmitData) => {
    return {
      kind: operationKind as number,
      sender: userAddress,
      recipient: transactionItem.receiverAddress as Address,
      asset: transactionItem.tokenAddress,
      amount: parseUnits(
        transactionItem.tokenAmount,
        transactionItem.tokenDecimals
      ),
    };
  });
  const config = await prepareWriteContract({
    address: vaultAddress[5],
    abi: vaultABI,
    functionName: "manageUserBalance",
    value: parseUnits("0", data[0].tokenDecimals),
    args: [userBalancesOp],
  });
  return await writeContract(config);
}
