"use client";

import { formatNumber, toast } from "@bleu/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Button } from "#/components";
import { TokenInfo } from "#/components/TokenInfo";
import { Form, FormMessage } from "#/components/ui/form";
import { useAmmData } from "#/contexts/ammData";
import { useManagedTransaction } from "#/hooks/tx-manager/useManagedTransaction";
import { useDebounce } from "#/hooks/useDebounce";
import {
  PRICE_IMPACT_THRESHOLD,
  USD_VALUE_FOR_PRICE_IMPACT_WARNING,
} from "#/lib/constants";
import { ICowAmm } from "#/lib/fetchAmmData";
import { calculatePriceImpact } from "#/lib/priceImpact";
import { getDepositSchema } from "#/lib/schema";
import { buildDepositAmmArgs } from "#/lib/transactionFactory";

import { AlertCard } from "./AlertCard";
import { TokenAmountInput } from "./TokenAmountInput";

export function DepositForm({
  ammData,
  walletBalanceToken0,
  walletBalanceToken1,
}: {
  ammData: ICowAmm;
  walletBalanceToken0: string;
  walletBalanceToken1: string;
}) {
  const { mutateAmm } = useAmmData();
  const schema = getDepositSchema(
    Number(walletBalanceToken0),
    Number(walletBalanceToken1),
  );

  const form = useForm<z.input<typeof schema>>({
    // @ts-ignore
    resolver: zodResolver(schema),
  });

  const {
    formState: { errors, isSubmitting },
    control,
  } = form;

  const {
    writeContract,
    writeContractWithSafe,
    status,
    isWalletContract,
    isPonderAPIUpToDate,
  } = useManagedTransaction();

  const [amount0, amount1] = useWatch({
    control,
    name: ["amount0", "amount1"],
  });
  const depositUsdValue =
    ammData.token0.usdPrice * amount0 + ammData.token1.usdPrice * amount1;

  const priceImpact = calculatePriceImpact({
    balance0: Number(ammData.token0.balance),
    balance1: Number(ammData.token1.balance),
    amount0: Number(amount0),
    amount1: Number(amount1),
  });

  const debouncedPriceImpact = useDebounce<number>(priceImpact, 300);
  const debouncedDepositUsdValue = useDebounce<number>(depositUsdValue, 300);

  const onSubmit = async (data: z.output<typeof schema>) => {
    const txArgs = buildDepositAmmArgs({
      cowAmm: ammData,
      amount0: data.amount0,
      amount1: data.amount1,
    });

    try {
      if (isWalletContract) {
        writeContractWithSafe(txArgs);
      } else {
        // TODO: remove this once we add EOA support
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
    if (!isPonderAPIUpToDate) return;
    mutateAmm();
  }, [isPonderAPIUpToDate]);

  return (
    // @ts-ignore
    <Form {...form} onSubmit={onSubmit} className="flex flex-col gap-y-5">
      <div className="flex gap-x-2 w-full items-start justify-between">
        <div className="w-1/3">
          <TokenInfo token={ammData.token0} showBalance={false} />
        </div>
        <TokenAmountInput
          token={ammData.token0}
          form={form}
          fieldName="amount0"
          defaultWalletAmount={walletBalanceToken0}
        />
      </div>
      <div className="flex gap-x-2 w-full items-start justify-between">
        <div className="w-1/3">
          <TokenInfo token={ammData.token1} showBalance={false} />
        </div>
        <TokenAmountInput
          form={form}
          token={ammData.token1}
          fieldName="amount1"
          defaultWalletAmount={walletBalanceToken1}
        />
      </div>
      {
        // @ts-ignore
        errors?.bothAmountsAreZero && (
          <FormMessage className="text-sm text-destructive w-full">
            <p className="text-wrap">
              {
                // @ts-ignore
                errors.bothAmountsAreZero.message as string
              }
            </p>
          </FormMessage>
        )
      }
      {debouncedDepositUsdValue > USD_VALUE_FOR_PRICE_IMPACT_WARNING &&
        debouncedPriceImpact > PRICE_IMPACT_THRESHOLD && (
          <AlertCard style="warning" title="High Price Impact">
            <p>
              The price impact of this deposit is{" "}
              {formatNumber(debouncedPriceImpact * 100, 2)}%. Deposits with high
              price impact may result in lost funds.
            </p>
          </AlertCard>
        )}

      <Button
        loading={
          isSubmitting ||
          !["final", "idle", "confirmed", "error"].includes(status || "")
        }
        variant="highlight"
        type="submit"
        className="w-full mt-2"
        disabled={!amount0 && !amount1}
      >
        Deposit ${formatNumber(debouncedDepositUsdValue, 2)}
      </Button>
    </Form>
  );
}
