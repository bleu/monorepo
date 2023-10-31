"use client";

import {
  Address,
  Network,
  NetworkChainId,
  networkFor,
} from "@bleu-balancer-tools/utils";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useAccount, useNetwork } from "wagmi";

import {
  STAGE_CN_MAPPING,
  TransactionProgressBar,
} from "#/app/milkman/components/TransactionProgressBar";
import { TransactionStatus } from "#/app/milkman/utils/type";
import { Button } from "#/components";
import { Input } from "#/components/Input";
import { LinkComponent } from "#/components/Link";
import { Spinner } from "#/components/Spinner";
import { Form } from "#/components/ui/form";
import WalletNotConnected from "#/components/WalletNotConnected";
import { getNetwork } from "#/contexts/networks";

export default function Page({
  params,
}: {
  params: {
    network: Network;
  };
}) {
  const { chain } = useNetwork();
  const { isConnected, isReconnecting, isConnecting } = useAccount();
  const { address } = useAccount();

  const addressLower = address ? address?.toLowerCase() : "";

  if (!isConnected && !isReconnecting && !isConnecting) {
    return <WalletNotConnected />;
  }

  if (isConnecting || isReconnecting) {
    return <Spinner />;
  }

  const network = getNetwork(chain?.name);

  if (network !== params.network) {
    return (
      <div className="flex h-full w-full flex-col items-center rounded-3xl px-12 py-16 md:py-20">
        <div className="text-center text-3xl text-amber9">
          You are on the wrong network
        </div>
        <div className="text-xl text-white">
          Please change to {params.network}
        </div>
      </div>
    );
  }

  return (
    <>
      <TransactionCard
        userAddress={addressLower as Address}
        chainId={chain?.id}
      />
    </>
  );
}

function TransactionCard({
  userAddress,
  chainId,
  walletAmount,
}: {
  userAddress: Address;
  chainId?: NetworkChainId;
  walletAmount?: string;
  walletAmountBigNumber?: bigint;
}) {
  const network = networkFor(chainId);

  const form = useForm();
  const { register, setValue } = form;

  useEffect(() => {
    register("receiverAddress");
    setValue("tokenAddress", "0x768788EB28d25C351E502cd7c5882C63C0876237");
  }, []);

  function handleOnSubmit(data: FieldValues) {
    // eslint-disable-next-line no-console
    console.log(data);
  }

  const stage = STAGE_CN_MAPPING[TransactionStatus.ORDER_PLACED];

  return (
    <div className="flex h-full items-center justify-center w-full">
      <Form
        {...form}
        onSubmit={handleOnSubmit}
        className="my-4 flex h-fit w-fit flex-col divide-y divide-slate7 rounded-lg border border-slate7 bg-blue3 text-white"
      >
        <div className="relative flex h-full w-full justify-center">
          <LinkComponent
            loaderColor="amber"
            href={`/internalmanager/${network}`}
            content={
              <div className="absolute left-8 flex h-full items-center">
                <ArrowLeftIcon
                  height={16}
                  width={16}
                  className="text-slate10 duration-200 hover:text-amber10"
                />
              </div>
            }
          />
          <div className="flex min-w-[530px] flex-col items-center py-3">
            <div className="text-xl">Create order</div>
          </div>
        </div>
        <div className="flex flex-col gap-y-6 p-9">
          <div>
            <div className="flex h-fit justify-between gap-7">
              <div className="w-1/2">
                <Input
                  type="string"
                  label="Token sell"
                  placeholder="0x.."
                  {...register("tokenSell")}
                />
              </div>
              <div className="flex w-1/2 items-end gap-2">
                <div className="w-full">
                  <Input
                    type="string"
                    label="Amount"
                    placeholder="0.0"
                    {...register("tokenAmount")}
                  />
                </div>
              </div>
            </div>
            <div className="mt-2 flex gap-x-1 text-xs">
              <span className="text-slate10">
                <span>Wallet Balance: {walletAmount}</span>
              </span>
              <button
                type="button"
                className="text-blue9 outline-none hover:text-amber9"
                onClick={() => {
                  setValue("tokenAmount", walletAmount);
                }}
              >
                Max
              </button>
            </div>
          </div>
          <div className="w-full">
            <Input
              type="string"
              label="Token buy"
              placeholder="0x.."
              {...register("tokenBuy")}
            />
          </div>
          <div>
            <div>
              <Input
                type="string"
                label="Recipient"
                placeholder={userAddress}
                {...register("receiverAddress")}
              />
              <div className="mt-2 flex gap-x-1 text-xs">
                <button
                  type="button"
                  className="text-blue9 outline-none hover:text-amber9"
                  onClick={() => {
                    setValue("receiverAddress", userAddress);
                  }}
                >
                  Use Current Address
                </button>
              </div>
            </div>
          </div>
          <div>
            <div>
              <Input
                type="string"
                label="Valid from"
                placeholder={userAddress}
                {...register("validFrom")}
              />
              <div className="mt-2 flex gap-x-1 text-xs">
                <button
                  type="button"
                  className="text-blue9 outline-none hover:text-amber9"
                  onClick={() => {
                    setValue("validFrom", new Date().toISOString());
                  }}
                >
                  Use Current Date time
                </button>
              </div>
            </div>
          </div>
          <TransactionProgressBar stage={stage} />
          <div className="flex justify-center">
            <Button type="submit" className="w-full">
              <span>Continue</span>
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}
