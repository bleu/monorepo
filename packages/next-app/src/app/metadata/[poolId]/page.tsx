"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "#/components";
import useDebounce from "#/hooks/useDebounce";
import metadataGql from "#/lib/poolMetadataGql";
import {
  usePoolMetadataRegistrySetPoolMetadata,
  usePreparePoolMetadataRegistrySetPoolMetadata
} from "#/wagmi/generated";

export default function Page({ params }: { params: { poolId: `0x${string}` } }) {
  const textField = useRef<HTMLTextAreaElement>(null);

  const [metadata, setMetadata] = useState("");

  const [pinned, setPinned] = useState("");
  const [metadataCID, setMetadataCID] = useState("");
  const debouncedCID = useDebounce(metadataCID, 500);

  const { data: pools } = metadataGql.useMetadataPool({
    poolId: params.poolId,
  });
  const metadataPool = pools?.pools[0];

  useEffect(() => {
    if (metadataPool?.metadataCID) {
      fetch(`https://gateway.pinata.cloud/ipfs/${metadataPool?.metadataCID}`)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setMetadata(JSON.stringify(data, null, 2));
        });
    }
  }, [metadataPool?.metadataCID]);

  const { config } = usePreparePoolMetadataRegistrySetPoolMetadata({
    address: "0xebfadf723e077c80f6058dc9c9202bb613de07cf",
    args: [params.poolId, debouncedCID],
    enabled: Boolean(debouncedCID),
  });

  const { data, isLoading, isSuccess, isError, write } =
    usePoolMetadataRegistrySetPoolMetadata(config);

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
        setMetadataCID(data.IpfsHash);
      });
  }

  return (
    <div className="flex-1 justify-center space-y-2 p-4 text-white">
      <div className="flex flex-col">
        <div>Pool ID: {params.poolId}</div>
        {metadataPool ? (
          <pre>{JSON.stringify(metadataPool, null, 2)}</pre>
        ) : (
          <div>PoolMetadata not found for this Pool.</div>
        )}
      </div>
      <div className="flex flex-col">
        <div>Fetching {metadataPool?.metadataCID}...</div>
        {!!metadata && (
          <>
            <textarea
              ref={textField}
              onChange={(e) => {
                setMetadata(e.target.value);
              }}
              className="text-cyan-800"
              cols={90}
              rows={13}
              value={metadata}
            />
            <Button
              onClick={pinJSON}
              className="bg-indigo-500 text-gray-50 hover:bg-indigo-400 focus-visible:outline-indigo-500 disabled:bg-gray-600"
            >
              Pin new JSON
            </Button>
          </>
        )}
      </div>
      {pinned && (
        <div>
          IPFS data: <br />
          <pre>{JSON.stringify(pinned, null, 2)}</pre>
        </div>
      )}

      <div className="flex flex-col">
        <Button
          disabled={!write}
          onClick={write}
          className="bg-indigo-500 text-gray-50 hover:bg-indigo-400 focus-visible:outline-indigo-500 disabled:bg-gray-600"
        >
          Set / Update PoolMetadata
        </Button>
      </div>
      {isLoading && <div>Updating pool metadata...</div>}
      {isSuccess && (
        <div>
          New Pool Metadata: <br />
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
      {isError && <div>Error setting new Pool Metadata!</div>}
    </div>
  );
}
