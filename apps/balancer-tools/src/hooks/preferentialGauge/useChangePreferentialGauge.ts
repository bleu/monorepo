import { Address, NetworkChainId } from "@bleu-fi/utils";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { useEffect } from "react";
import { encodeFunctionData } from "viem";

import { eventEmitterABI } from "#/abis/eventEmitter";
import { usePreferentialGauge } from "#/contexts/PreferetialGaugeContext";

import { NotificationVariant } from "../useTransaction";

const identifier =
  "0x88aea7780a038b8536bb116545f59b8a089101d5e526639d3c54885508ce50e2";

export const eventEmitterAddress: Partial<{ [key: number]: string }> = {
  [Number(NetworkChainId.ETHEREUM)]:
    "0x1acfeea57d2ac674d7e65964f155ab9348a6c290",
  [Number(NetworkChainId.GOERLI)]: "0x59c0f0c75cc64f2e8155c6b90e00208e1183a909",
};

export function useChangePreferentialGauge() {
  const { setNotification, isNotifierOpen, setIsNotifierOpen, notification } =
    usePreferentialGauge();
  const { sdk } = useSafeAppsSDK();
  async function setPrerentialGauge({
    oldGaugeAddress,
    newGaugeAddress,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    userAddress,
    chainId,
  }: {
    oldGaugeAddress: string;
    newGaugeAddress: string;
    userAddress: string;
    chainId: number;
  }) {
    if (!newGaugeAddress) return;
    //TODO Check if user is allowed to do this

    // eslint-disable-next-line no-console
    if (oldGaugeAddress === newGaugeAddress) {
      setNotification({
        title: "Error!",
        description: "Same gauge selected",
        variant: NotificationVariant.ALERT,
      });
      return;
    } else if (!oldGaugeAddress) {
      setNotification({
        title: "Confirm transaction",
        description: "Check your wallet to confirm",
        variant: NotificationVariant.PENDING,
      });
      await sdk.txs.send({
        txs: [
          {
            to: eventEmitterAddress[chainId] as string,
            value: "0",
            data: encodeFunctionData({
              abi: eventEmitterABI,
              functionName: "emitEvent",
              args: [identifier, newGaugeAddress as Address, 1n],
            }),
          },
        ],
      });
    } else {
      await sdk.txs.send({
        txs: [
          {
            to: eventEmitterAddress[chainId] as string,
            value: "0",
            data: encodeFunctionData({
              abi: eventEmitterABI,
              functionName: "emitEvent",
              args: [identifier, oldGaugeAddress as Address, 0n],
            }),
          },
          {
            to: eventEmitterAddress[chainId] as string,
            value: "0",
            data: encodeFunctionData({
              abi: eventEmitterABI,
              functionName: "emitEvent",
              args: [identifier, newGaugeAddress as Address, 1n],
            }),
          },
        ],
      });
    }
  }

  const handleNotifier = () => {
    if (isNotifierOpen) {
      setIsNotifierOpen(false);
      setTimeout(() => {
        setIsNotifierOpen(true);
      }, 100);
    } else {
      setIsNotifierOpen(true);
    }
  };

  useEffect(() => {
    if (!notification) return;
    handleNotifier();
  }, [notification]);

  return { setPrerentialGauge };
}
