"use client";

import { toast } from "@bleu/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Button } from "#/components";
import { TokenInfo } from "#/components/TokenInfo";
import { Form, FormMessage } from "#/components/ui/form";
import { useManagedTransaction } from "#/hooks/tx-manager/useManagedTransaction";
import { ICowAmm } from "#/lib/fetchAmmData";
import { getDepositSchema } from "#/lib/schema";
import { buildDepositAmmArgs } from "#/lib/transactionFactory";

import { TokenAmountInput } from "./TokenAmountInput";

export function DepositForm({
  cowAmmData,
  walletBalanceToken0,
  walletBalanceToken1,
}: {
  cowAmmData: ICowAmm;
  walletBalanceToken0: string;
  walletBalanceToken1: string;
}) {
  const schema = getDepositSchema(
    Number(walletBalanceToken0),
    Number(walletBalanceToken1)
  );

  const form = useForm<z.input<typeof schema>>({
    // @ts-ignore
    resolver: zodResolver(schema),
  });

  const {
    formState: { errors, isSubmitting },
    control,
  } = form;

  const { writeContract, writeContractWithSafe, status, isWalletContract } =
    useManagedTransaction();

  const [amount0, amount1] = useWatch({
    control,
    name: ["amount0", "amount1"],
  });

  const onSubmit = async (data: z.output<typeof schema>) => {
    const txArgs = buildDepositAmmArgs({
      cowAmm: cowAmmData,
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
      // router.push(`${cowAmmData.user.id}/amms/${cowAmmData.id}`);
    } catch {
      toast({
        title: `Transaction failed`,
        description: "An error occurred while processing the transaction.",
        variant: "destructive",
      });
    }
  };

  return (
    // @ts-ignore
    <Form {...form} onSubmit={onSubmit} className="flex flex-col gap-y-3">
      <div className="flex gap-x-2 w-full items-start justify-between">
        <div className="w-1/3">
          <TokenInfo token={cowAmmData.token0} showBalance={false} />
        </div>
        <TokenAmountInput
          token={cowAmmData.token0}
          form={form}
          fieldName="amount0"
        />
      </div>
      <div className="flex gap-x-2 w-full items-start justify-between">
        <div className="w-1/3">
          <TokenInfo token={cowAmmData.token1} showBalance={false} />
        </div>
        <TokenAmountInput
          form={form}
          token={cowAmmData.token1}
          fieldName="amount1"
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
        Deposit
      </Button>
    </Form>
  );
}
