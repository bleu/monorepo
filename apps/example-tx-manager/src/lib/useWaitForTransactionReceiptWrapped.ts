import {
  useAccount,
  // useQuery,
  useWaitForTransactionReceipt,
} from "wagmi";

import { useIsWalletContract } from "./useIsWalletContract";
import { useSafeTransaction } from "./useSafeTransaction";

export const useWaitForTransactionReceiptWrapped = (
  args: Parameters<typeof useWaitForTransactionReceipt>[0]
) => {
  const { address } = useAccount();
  const { data: isWalletContract } = useIsWalletContract(address);

  const plain = useWaitForTransactionReceipt({
    ...args,
    hash: isWalletContract === false ? args?.hash : undefined,
  });

  const gnosis = useSafeTransaction({
    safeHash: args?.hash,
  });
  console.log({ gnosis, isWalletContract, address });
  const gnosisData = useWaitForTransactionReceipt({
    ...args,
    hash: gnosis.data,
  });

  if (isWalletContract) {
    return {
      safeHash: args?.hash,
      ...gnosisData,
      hash: gnosis.data,
      safeStatus: gnosis.status,
      status: gnosisData.status,
    };
  }

  return {
    ...plain,
    hash: isWalletContract === false ? args?.hash : undefined,
    safeHash: null,
    safeStatus: null,
  };
};
