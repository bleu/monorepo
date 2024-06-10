"use client";
import { wagmiMintExampleAbi } from "abitype/abis";
import React from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

import { MintNFT } from "./(components)/mintNft";
import { useAutoConnect } from "@/lib/useAutoConnect";

function TransactionManager({ contractAddress, abi }) {
  return (
    <div>
      <p>contract: {contractAddress}</p>
      <p>abi: {abi.length > 0 ? "present" : ""}</p>
    </div>
  );
}

function App() {
  const { address, status, chain } = useAccount();
  const { connect, connectors, error } = useConnect();
  const { disconnect } = useDisconnect();
  useAutoConnect();

  return (
    <>
      <div>
        <h2>Account</h2>
        <div>
          status: {status}
          <br />
          address: {address}
          <br />
          chainId: {chain?.id}
        </div>
        {status === "connected" && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>
      <div>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <button
            key={connector.id}
            onClick={() => connect({ connector })}
            type="button"
          >
            {connector.name}
          </button>
        ))}
        <div>{status}</div>
        <div>{error?.message}</div>
      </div>
      {status === "connected" && (
        <>
          <TransactionManager
            contractAddress="0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2"
            abi={wagmiMintExampleAbi}
          />
          <MintNFT />
        </>
      )}
    </>
  );
}

export default App;
