import * as React from "react";
import { encodeFunctionData, encodePacked, erc20Abi, size } from "viem";
import { type BaseError } from "wagmi";

import { useManagedTransaction } from "@/lib/useManagedTransaction";

const multisendABI = [
  {
    inputs: [{ internalType: "bytes", name: "transactions", type: "bytes" }],
    name: "multiSend",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
] as const;

export function MintNFT() {
  const { hash, error, writeContract, status, safeHash } =
    useManagedTransaction();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const txData = {
      to: "0xbe72E441BF55620febc26715db68d3494213D8Cb",
      value: "0",
      data: encodeFunctionData({
        abi: erc20Abi,
        functionName: "approve",
        args: [
          "0x88f2178139Ed9F6D870b3afc293eb735F54d655e",
          BigInt("1000000000000000"),
        ],
      }),
    } as const;

    const encodedTx = encodePacked(
      ["uint8", "address", "uint256", "uint256", "bytes"],
      [
        0,
        txData.to,
        BigInt(txData.value),
        BigInt(size(txData.data)),
        txData.data,
      ],
    );

    const duplicatedEncodedTx = (encodedTx +
      encodedTx.slice(2)) as `0x${string}`;

    writeContract({
      address: "0x40A2aCCbd92BCA938b02010E17A5b8929b49130D",
      abi: multisendABI,
      functionName: "multiSend",
      args: [duplicatedEncodedTx],
    });
  }

  const isPending = status === "pending";
  const isConfirming = status === "confirming";
  const isConfirmed = status === "confirmed";

  return (
    <form onSubmit={submit}>
      <input name="value" placeholder="0.05" required />
      <button disabled={isPending} type="submit">
        {isPending ? "Confirming..." : "Mint"}
      </button>
      {hash && <div>Transaction Hash: {hash}</div>}
      {isConfirming && <div>Waiting for confirmation...</div>}
      {isConfirmed && <div>Transaction confirmed.</div>}
      {error && (
        <div>Error: {(error as BaseError).shortMessage || error.message}</div>
      )}

      {safeHash && <div>Safe Transaction Hash: {safeHash}</div>}

      {status && <div>State: {status}</div>}
    </form>
  );
}
