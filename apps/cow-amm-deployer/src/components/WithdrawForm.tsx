"use client";

import { formatNumber, toast } from "@bleu/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Slider from "@radix-ui/react-slider";
import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { parseUnits } from "viem";
import { useAccount } from "wagmi";

import { Button } from "#/components/Button";
import { TokenAmount } from "#/components/TokenAmount";
import { Form } from "#/components/ui/form";
import { useAmmData } from "#/contexts/ammData";
import { useManagedTransaction } from "#/hooks/tx-manager/useManagedTransaction";
import { ICowAmm } from "#/lib/fetchAmmData";
import { ammWithdrawSchema } from "#/lib/schema";
import {
  TRANSACTION_TYPES,
  WithdrawCoWAMMArgs,
} from "#/lib/transactionFactory";
import { ChainId } from "#/utils/chainsPublicClients";

export function WithdrawForm({ ammData }: { ammData: ICowAmm }) {
  const { mutateAmm } = useAmmData();
  const form = useForm<typeof ammWithdrawSchema._type>({
    // @ts-ignore
    resolver: zodResolver(ammWithdrawSchema),
    defaultValues: {
      withdrawPct: 0,
    },
  });
  const { chainId } = useAccount();

  const { writeContract, writeContractWithSafe, status, isWalletContract } =
    useManagedTransaction();

  const onSubmit = async (data: typeof ammWithdrawSchema._type) => {
    let amount0 = BigInt(0);
    let amount1 = BigInt(0);
    if (data.withdrawPct === 100) {
      // avoid floating point arithmetic
      amount0 = parseUnits(ammData.token0.balance, ammData.token0.decimals);
      amount1 = parseUnits(ammData.token1.balance, ammData.token1.decimals);
    } else {
      amount0 = parseUnits(
        String((Number(ammData.token0.balance) * data.withdrawPct) / 100),
        ammData.token0.decimals,
      );
      amount1 = parseUnits(
        String((Number(ammData.token1.balance) * data.withdrawPct) / 100),
        ammData.token1.decimals,
      );
    }
    const txArgs = {
      type: TRANSACTION_TYPES.WITHDRAW_COW_AMM,
      amm: ammData.order.owner,
      amount0,
      amount1,
      chainId: chainId as ChainId,
    } as WithdrawCoWAMMArgs;
    try {
      if (isWalletContract) {
        writeContractWithSafe([txArgs]);
      } else {
        // @ts-ignore
        writeContract(txArgs);
      }
    } catch {
      toast({
        title: `Transaction failed`,
        description: "An error occurred while processing the transaction.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (status === "confirmed") {
      mutateAmm();
    }
  }, [status]);

  const {
    control,
    setValue,
    formState: { isSubmitting },
  } = form;

  const withdrawPct = useWatch({ control, name: "withdrawPct" });

  return (
    <Form {...form} onSubmit={onSubmit} className="flex flex-col gap-y-5">
      <div className="flex flex-col w-full">
        <div className="flex justify-between mb-2 items-center">
          <span className="block text-xl bg-primary p-2">{withdrawPct}%</span>
          <div className="flex justify-between w-1/2">
            {[25, 50, 75, 100].map((pct) => (
              <Button
                key={pct}
                type="button"
                className="px-2"
                variant="ghost"
                disabled={isSubmitting || !pct}
                onClick={() => setValue("withdrawPct", pct)}
              >
                {pct === 100 ? "Max" : `${pct}%`}
              </Button>
            ))}
          </div>
        </div>

        <Controller
          name="withdrawPct"
          control={control}
          render={({ field }) => (
            <Slider.Root
              className="relative flex items-center select-none touch-none w-full h-5"
              max={100}
              step={0.1}
              min={0}
              onValueChange={(value) => field.onChange(value[0])}
              value={[field.value]}
            >
              <Slider.Track className="relative grow rounded-full h-[3px]">
                <Slider.Range className="absolute bg-primary rounded-full h-full" />
              </Slider.Track>
              <Slider.Thumb className="block w-5 h-5 bg-primary rounded-[10px] hover:bg-primary/90 focus:outline-none" />
            </Slider.Root>
          )}
        />
      </div>
      <div className="flex flex-row gap-2">
        <span className="font-semibold">You'll receive:</span>
        <TokenAmount
          token={ammData.token0}
          balance={Number(ammData.token0.balance) * withdrawPct}
          usdPrice={ammData.token0.usdPrice}
        />
        <TokenAmount
          token={ammData.token1}
          balance={Number(ammData.token1.balance) * withdrawPct}
          usdPrice={ammData.token1.usdPrice}
        />
      </div>
      <Button
        variant="highlight"
        disabled={
          !withdrawPct ||
          (ammData.token0.balance === "0" && ammData.token1.balance === "0")
        }
        type="submit"
        className="w-full"
        loading={
          isSubmitting ||
          !["final", "idle", "confirmed", "error"].includes(status || "")
        }
      >
        Withdraw ${formatNumber((ammData.totalUsdValue * withdrawPct) / 100, 4)}
      </Button>
    </Form>
  );
}
