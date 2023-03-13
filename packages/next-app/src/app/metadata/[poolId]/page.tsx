"use client";

import { useRef, useState } from "react";

import { Button } from "#/components";
import metadataGql from "#/lib/poolMetadataGql";

export default function Page({ params }: { params: { poolId: string } }) {
  const textField = useRef<HTMLTextAreaElement>(null);

  const [metadata, setMetadata] = useState(`[
    {
      "name": "Pool Address",
      "type": "address",
      "desc": "The address of the smart contract that implements the exchange pool",
      "value": "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
    },
    {
      "name": "Pool link",
      "type": "URL",
      "desc": "The address of the smart contract that implements the exchange pool",
      "value": "https://github.com/"
    }
  ]`);

  const [pinned, setPinned] = useState("");

  const { data: pools } = metadataGql.useMetadataPool({
    poolId: params.poolId,
  });
  const metadataPool = pools?.pools[0];

  async function pinJSON() {
    fetch(`./${params.poolId}/pin`, {
      method: "POST",
      body: `{ "metadata": ${textField.current?.value} }`,
      headers: {
        "Content-Type": "application/json; charset=utf8",
      },
      mode: "no-cors",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setPinned(data);
      });
  }

  return (
    <div className="flex-1 justify-center space-y-4 p-4 text-white">
      <div className="flex flex-col">
        <div>Pool Identified</div>
        <pre>{JSON.stringify(metadataPool, null, 2)}</pre>
      </div>
      <div className="flex flex-col">
        <textarea
          ref={textField}
          onChange={(e) => {
            setMetadata(e.target.value);
          }}
          className="text-cyan-800"
          cols={90}
          rows={15}
          value={metadata}
        />
        <Button
          onClick={pinJSON}
          className="bg-indigo-500 text-gray-50 hover:bg-indigo-400 focus-visible:outline-indigo-500 disabled:bg-gray-600"
        >
          Pin new JSON
        </Button>
      </div>
      {pinned && (
        <div>
          IPFS data: <br />
          <pre>{JSON.stringify(pinned, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
