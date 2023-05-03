import { EvmChain } from "@moralisweb3/common-evm-utils";
import Moralis from "moralis";

Moralis.start({
  apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY as string,
});

export async function moralisGetTokens({
  userAddress,
  chain,
}: {
  userAddress: string;
  chain: "Ethereum" | "Goerli";
}) {
  const chainMoralis =
    chain === "Ethereum" ? EvmChain.ETHEREUM : EvmChain.GOERLI;

  const response = await Moralis.EvmApi.token.getWalletTokenBalances({
    address: userAddress,
    chain: chainMoralis,
  });

  return response.toJSON();
}
