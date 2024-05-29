import { Address } from "viem";

import { fetchWalletTokenBalance } from "#/lib/tokenUtils";
import { IToken } from "#/lib/types";
import { ChainId } from "#/utils/chainsPublicClients";

export async function getBalancesFromContract([
  _,
  chainId,
  address,
  token0,
  token1,
]: [string, ChainId, Address, IToken, IToken]) {
  const [token0Balance, token1Balance] = await Promise.all([
    fetchWalletTokenBalance({
      token: token0,
      walletAddress: address,
      chainId,
    }),
    fetchWalletTokenBalance({
      token: token1,
      walletAddress: address,
      chainId,
    }),
  ]);

  return {
    token0: {
      balance: token0Balance,
    },
    token1: {
      balance: token1Balance,
    },
  };
}
