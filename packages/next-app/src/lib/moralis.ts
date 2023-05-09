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
  chain: "Ethereum" | "Goerli" | "Sepolia";
}) {
  const chainMoralis =
    chain === "Ethereum" ? EvmChain.ETHEREUM : chain=== "Goerli"  ? EvmChain.GOERLI : EvmChain.SEPOLIA;

  const response = await Moralis.EvmApi.token.getWalletTokenBalances({
    address: userAddress,
    chain: chainMoralis,
  });

  return response.toJSON();
}
