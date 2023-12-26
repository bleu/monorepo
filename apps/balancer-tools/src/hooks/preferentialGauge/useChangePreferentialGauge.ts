import { waitForTransaction } from "@wagmi/core";
import { useEffect } from "react";

import { usePreferentialGauge } from "#/contexts/PreferetialGaugeContext";
import { writeEmitEvent } from "#/wagmi/writeEmitEvent";

import { NotificationVariant } from "../useTransaction";
import { useTransactionStatus } from "./useTransactionStatus";

export function useChangePreferentialGauge() {
  const { setNotification, isNotifierOpen, setIsNotifierOpen, notification } =
    usePreferentialGauge();
  const { handleTransactionStatus } = useTransactionStatus();
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
      try {
        setNotification({
          title: "Confirm transaction",
          description: "Check your wallet to confirm",
          variant: NotificationVariant.PENDING,
        });
        const { hash } = await writeEmitEvent({
          gaugeAddress: newGaugeAddress,
          active: true,
          chainId,
        });
        handleTransactionStatus({
          hash,
          chainId,
        });
        const waitForTransactionData = await waitForTransaction({
          hash,
        });
        if (waitForTransactionData.status === "success") {
          setNotification({
            title: "Great!",
            description: "The transaction was a success!",
            variant: NotificationVariant.SUCCESS,
          });
        }
      } catch (error) {
        setNotification({
          title: "Error!",
          description: "Error while setting new gauge",
          variant: NotificationVariant.ALERT,
        });
      }
      return;
    }
    try {
      setNotification({
        title: "Confirm transaction",
        description: "Check your wallet to confirm",
        variant: NotificationVariant.PENDING,
      });
      //AQUI deveria ser uma multicall,
      await writeEmitEvent({
        gaugeAddress: oldGaugeAddress,
        active: false,
        chainId,
      });
      try {
        const { hash } = await writeEmitEvent({
          gaugeAddress: newGaugeAddress,
          active: true,
          chainId,
        });
        handleTransactionStatus({
          hash,
          chainId,
        });
        const waitForTransactionData = await waitForTransaction({
          hash,
        });
        if (waitForTransactionData.status === "success") {
          setNotification({
            title: "Great!",
            description: "The transaction was a success!",
            variant: NotificationVariant.SUCCESS,
          });
        }
      } catch (error) {
        setNotification({
          title: "Error!",
          description: "Error while setting new gauge",
          variant: NotificationVariant.ALERT,
        });
      }
    } catch (error) {
      setNotification({
        title: "Error!",
        description: "Error while deactivating old gauge",
        variant: NotificationVariant.ALERT,
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
