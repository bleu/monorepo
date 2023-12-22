import { Address } from "@bleu-fi/utils";
import { prepareWriteContract, writeContract } from "@wagmi/core";

import { eventEmitterABI } from "#/abis/eventEmitter";

const identifier =
  "0x88aea7780a038b8536bb116545f59b8a089101d5e526639d3c54885508ce50e2";

export async function writeEmitEvent({
  gaugeAddress,
  active,
}: {
  gaugeAddress: string;
  active: boolean;
}) {
  // eslint-disable-next-line no-console
  const config = await prepareWriteContract({
    address: gaugeAddress as Address,
    abi: eventEmitterABI,
    functionName: "emitEvent",
    args: [identifier, gaugeAddress, active ? 1 : 0],
  });

  return await writeContract(config);
}

export async function setPrerentialGauge({
  oldGaugeAddress,
  newGaugeAddress,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  userAddress,
}: {
  oldGaugeAddress: string;
  newGaugeAddress: string;
  userAddress: string;
}) {
  //TODO Check if user is allowed to do this

  // eslint-disable-next-line no-console
  console.log(userAddress);

  if (oldGaugeAddress === newGaugeAddress || !oldGaugeAddress) {
    try {
      await writeEmitEvent({
        gaugeAddress: newGaugeAddress,
        active: true,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
    return;
  }
  try {
    await writeEmitEvent({
      gaugeAddress: oldGaugeAddress,
      active: false,
    });
    try {
      await writeEmitEvent({
        gaugeAddress: newGaugeAddress,
        active: true,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}
