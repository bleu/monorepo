import { Address, NetworkChainId } from "@bleu-fi/utils";
import { prepareWriteContract, writeContract } from "@wagmi/core";

import { eventEmitterABI } from "#/abis/eventEmitter";

const identifier =
  "0x88aea7780a038b8536bb116545f59b8a089101d5e526639d3c54885508ce50e2";

export const eventEmitterAddress: Partial<{ [key in NetworkChainId]: string }> =
  {
    [NetworkChainId.ETHEREUM]: "0x1acfeea57d2ac674d7e65964f155ab9348a6c290",
    [NetworkChainId.GOERLI]: "0x59c0f0c75cc64f2e8155c6b90e00208e1183a909",
  };

export async function writeEmitEvent({
  gaugeAddress,
  active,
  chainId,
}: {
  gaugeAddress: string;
  active: boolean;
  chainId: number;
}) {
  const chainIdString = chainId.toString() as unknown as NetworkChainId;
  // eslint-disable-next-line no-console
  const config = await prepareWriteContract({
    address: eventEmitterAddress[chainIdString] as Address,
    abi: eventEmitterABI,
    functionName: "emitEvent",
    args: [identifier, gaugeAddress, active ? 1 : 0],
  });

  return await writeContract(config);
}
