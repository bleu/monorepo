"use client";

import { formatNumber, toast } from "@bleu/ui";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Slider from "@radix-ui/react-slider";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { parseUnits } from "viem";

import { Button } from "#/components/Button";
import Table from "#/components/Table";
import { TokenInfo } from "#/components/TokenInfo";
import { Form } from "#/components/ui/form";
import { useRawTxData } from "#/hooks/useRawTxData";
import { ICowAmm } from "#/lib/fetchAmmData";
import { ammWithdrawSchema } from "#/lib/schema";
import {
  TRANSACTION_TYPES,
  withdrawCowAMMargs,
} from "#/lib/transactionFactory";
import { ChainId } from "#/utils/chainsPublicClients";

export function WithdrawForm({ cowAmm }: { cowAmm: ICowAmm }) {
  const form = useForm<typeof ammWithdrawSchema._type>({
    // @ts-ignore
    resolver: zodResolver(ammWithdrawSchema),
    defaultValues: {
      withdrawPct: 50,
    },
  });
  const router = useRouter();
  const { sendTransactions } = useRawTxData();
  const {
    safe: { chainId },
  } = useSafeAppsSDK();

  const onSubmit = async (data: typeof ammWithdrawSchema._type) => {
    const amount0 = parseUnits(
      String((Number(cowAmm.token0.balance) * data.withdrawPct) / 100),
      cowAmm.token0.decimals
    );
    const amount1 = parseUnits(
      String((Number(cowAmm.token1.balance) * data.withdrawPct) / 100),
      cowAmm.token1.decimals
    );
    const txArgs = {
      type: TRANSACTION_TYPES.WITHDRAW,
      amm: cowAmm.order.owner,
      amount0,
      amount1,
      chainId: chainId as ChainId,
    } as withdrawCowAMMargs;
    try {
      await sendTransactions([txArgs]);
      router.push(`/amms/${cowAmm.id}`);
    } catch {
      toast({
        title: `Transaction failed`,
        description: "An error occurred while processing the transaction.",
        variant: "destructive",
      });
    }
  };

  const {
    control,
    formState: { isSubmitting },
  } = form;

  const { withdrawPct } = form.watch();

  return (
    <Form {...form} onSubmit={onSubmit} className="flex flex-col gap-y-3">
      <div className="flex flex-col w-full">
        <span className="mb-2 h-5 block">
          Withdraw percentage: {withdrawPct}%
        </span>
        <Controller
          name="withdrawPct"
          control={control}
          render={({ field }) => (
            <Slider.Root
              className="relative flex items-center select-none touch-none w-full h-5"
              max={100}
              step={0.1}
              min={0.1}
              onValueChange={field.onChange}
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
      <Table color="sand" classNames="overflow-y-auto">
        <Table.HeaderRow>
          <Table.HeaderCell>Balance</Table.HeaderCell>
          <Table.HeaderCell>
            Withdraw ($
            {formatNumber((cowAmm.totalUsdValue * withdrawPct) / 100, 4)})
          </Table.HeaderCell>
        </Table.HeaderRow>
        <Table.Body>
          {[cowAmm.token0, cowAmm.token1].map((token) => {
            return (
              <Table.BodyRow key={token.address}>
                <Table.BodyCell>
                  <TokenInfo token={token} />
                </Table.BodyCell>
                <Table.BodyCell>
                  <div className="flex flex-col gap-1 justify-end">
                    <span className="font-semibold">
                      {formatNumber(
                        (Number(token.balance) * withdrawPct) / 100,
                        4
                      )}{" "}
                      {token.symbol}
                    </span>
                    <span className="text-sm text-background/50">
                      $
                      {formatNumber(
                        (Number(token.usdValue) * withdrawPct) / 100,
                        4
                      )}
                    </span>
                  </div>
                </Table.BodyCell>
              </Table.BodyRow>
            );
          })}
        </Table.Body>
      </Table>
      <Button
        variant="highlight"
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        Withdraw
      </Button>
    </Form>
  );
}
