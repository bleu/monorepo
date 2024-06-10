import { Address } from "viem";
import { usePublicClient } from "wagmi";
import { useQuery } from "wagmi/query";

export const useIsWalletContract = (address: Address | undefined) => {
  const publicClient = usePublicClient();

  return useQuery({
    queryKey: ["isWalletContract", address],
    queryFn: async () => {
      if (!address) {
        return undefined;
      }
      const bytecode = await publicClient.getBytecode({
        address,
      });
      return bytecode !== undefined;
    },
  });
};
