import * as React from "react";
import { type BaseError } from "wagmi";

import { useManagedTransaction } from "@/lib/useManagedTransaction";

export const abi = [
  {
    name: "mint",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ internalType: "uint32", name: "tokenId", type: "uint32" }],
    outputs: [],
  },
] as const;

export function MintNFT() {
  const { hash, error, writeContract, status, safeHash } =
    useManagedTransaction();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const tokenId = formData.get("tokenId") as string;

    writeContract({
      address: "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2",
      abi,
      functionName: "mint",
      args: [Number(tokenId)],
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
