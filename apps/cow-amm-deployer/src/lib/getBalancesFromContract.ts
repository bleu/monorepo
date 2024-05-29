import { Address } from "viem";

import { IToken } from "#/lib/fetchAmmData";
import { fetchWalletTokenBalance } from "#/lib/tokenUtils";
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
