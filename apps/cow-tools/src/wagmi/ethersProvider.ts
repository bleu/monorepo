import { Address } from "@bleu-balancer-tools/utils";
import SafeApiKit from "@safe-global/api-kit";
import Safe, { EthersAdapter } from "@safe-global/protocol-kit";
import { MetaTransactionData } from "@safe-global/safe-core-sdk-types";
import { erc20ABI } from "@wagmi/core";
import { ethers, providers } from "ethers";
import { encodeFunctionData, type HttpTransport } from "viem";
import { type PublicClient } from "wagmi";

export function publicClientToProvider(publicClient: PublicClient) {
  const { chain, transport } = publicClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  if (transport.type === "fallback")
    return new providers.FallbackProvider(
      (transport.transports as ReturnType<HttpTransport>[]).map(
        ({ value }) => new providers.JsonRpcProvider(value?.url, network),
      ),
    );
  return new providers.JsonRpcProvider(transport.url, network);
}

export async function createMilkmanSimpleOrder(
  //TODO fix this any type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  publicClient: any,
  safeAddress: Address,
) {
  const provider = publicClientToProvider(publicClient);

  if (provider instanceof providers.FallbackProvider) {
    throw new Error("FallbackProvider not supported");
  }
  const safeOwner = provider.getSigner(0);

  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: safeOwner,
  });

  const txServiceUrl = "https://safe-transaction-goerli.safe.global"; // hardcoded
  const safeService = new SafeApiKit({ txServiceUrl, ethAdapter });

  const safeSdk = await Safe.create({ ethAdapter, safeAddress });

  //hardcoded
  const dummyTransactionData: MetaTransactionData[] = [
    {
      to: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
      data: encodeFunctionData({
        abi: erc20ABI,
        functionName: "approve",
        args: [
          "0x11C76AD590ABDFFCD980afEC9ad951B160F02797",
          BigInt(4000000000000000),
        ],
      }),
      value: "0",
    },
  ];

  const safeTransaction = await safeSdk.createTransaction({
    safeTransactionData: dummyTransactionData,
  });

  const safeTxHash = await safeSdk.getTransactionHash(safeTransaction);
  const senderSignature = await safeSdk.signTransactionHash(safeTxHash);
  await safeService.proposeTransaction({
    safeAddress,
    safeTransactionData: safeTransaction.data,
    safeTxHash,
    senderAddress: await safeOwner.getAddress(),
    senderSignature: senderSignature.data,
    origin,
  });

  return { safeTxHash, safeTransaction };
}
