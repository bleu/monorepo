import { toast } from "@bleu/ui";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Button } from "#/components";
import { Input } from "#/components/Input";
import { PriceOracleForm } from "#/components/PriceOracleForm";
import { TokenSelect } from "#/components/TokenSelect";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "#/components/ui/accordion";
import { Form } from "#/components/ui/form";
import { useRawTxData } from "#/hooks/useRawTxData";
import { IToken } from "#/lib/fetchAmmData";
import { ammFormSchema } from "#/lib/schema";
import { getNewMinTradeToken0 } from "#/lib/tokenUtils";
import { buildTxCreateAMMArgs } from "#/lib/transactionFactory";
import { cn } from "#/lib/utils";
import { ChainId } from "#/utils/chainsPublicClients";

import { TokenAmountInput } from "./TokenAmountInput";

export function CreateAMMForm({ userId }: { userId: string }) {
  const {
    safe: { safeAddress, chainId },
  } = useSafeAppsSDK();
  const router = useRouter();

  const form = useForm<z.input<typeof ammFormSchema>>({
    // @ts-ignore
    resolver: zodResolver(ammFormSchema),
    defaultValues: {
      safeAddress,
      chainId,
      priceOracleSchema: {
        chainId: chainId as ChainId,
      },
    },
  });

  const {
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = form;
  const { sendTransactions } = useRawTxData();

  const [token0, token1, priceOracle, amount0, amount1] = useWatch({
    control,
    name: [
      "token0",
      "token1",
      "priceOracleSchema.priceOracle",
      "amount0",
      "amount1",
    ],
  });

  const onSubmit = async (data: z.output<typeof ammFormSchema>) => {
    const txArgs = buildTxCreateAMMArgs({ data });

    try {
      await sendTransactions(txArgs);
      router.push(`${userId}/amms`);
    } catch {
      toast({
        title: `Transaction failed`,
        description: "An error occurred while processing the transaction.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    setValue("safeAddress", safeAddress);
  }, [safeAddress, setValue]);

  return (
    // @ts-ignore
    <Form {...form} onSubmit={onSubmit} className="flex flex-col gap-y-3">
      <div className="flex h-fit justify-between gap-x-7">
        <div className="w-full flex flex-col">
          <div className="flex flex-col w-full">
            <span className="mb-2 h-5 block text-sm">Token Pair</span>
            <TokenSelect
              onSelectToken={async (token: IToken) => {
                setValue("token0", {
                  decimals: token.decimals,
                  address: token.address,
                  symbol: token.symbol,
                });
                setValue(
                  "minTradedToken0",
                  await getNewMinTradeToken0(token, chainId as ChainId)
                );
              }}
              selectedToken={(token0 as IToken) ?? undefined}
              errorMessage={errors.token0?.message}
            />
          </div>
        </div>
        <div className="flex flex-col w-full">
          <div className="w-full flex flex-col">
            <span className="mb-2 h-5 block text-sm text-transparent">
              Select pair
            </span>
            <TokenSelect
              onSelectToken={(token: IToken) => {
                setValue("token1", {
                  decimals: token.decimals,
                  address: token.address,
                  symbol: token.symbol,
                });
              }}
              selectedToken={(token1 as IToken) ?? undefined}
              errorMessage={errors.token1?.message}
            />
          </div>
        </div>
      </div>
      <div className="flex h-fit justify-between gap-x-7">
        <div className="w-full flex flex-col">
          <div className="flex flex-col w-full">
            <span className="mb-2 h-5 block text-sm">Token amounts</span>
            <TokenAmountInput
              tokenFieldForm="token0"
              form={form}
              fieldName="amount0"
            />
          </div>
        </div>
        <div className="flex flex-col w-full">
          <div className="w-full flex flex-col">
            <span className="mb-2 h-5 block text-sm text-transparent" />
            <TokenAmountInput
              tokenFieldForm="token1"
              form={form}
              fieldName="amount1"
            />
          </div>
        </div>
      </div>
      {/* @ts-ignore */}
      <PriceOracleForm form={form} />
      <Accordion className="w-full" type="single" collapsible>
        <AccordionItem value="advancedOptions" key="advancedOption">
          <AccordionTrigger
            className={cn(
              errors.minTradedToken0 ? "text-destructive" : "",
              "pt-0"
            )}
          >
            Advanced Options
          </AccordionTrigger>
          <AccordionContent>
            <Input
              label="Minimum first token amount on each order"
              type="number"
              step={10 ** (-token0?.decimals || 18)}
              name="minTradedToken0"
              tooltipText="This parameter is used to not overload the CoW Orderbook with small orders. By default, 10 dollars worth of the first token will be the minimum amount for each order."
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex justify-center gap-x-5 mt-2">
        <Button
          loading={isSubmitting}
          variant="highlight"
          type="submit"
          className="w-full"
          disabled={
            isSubmitting ||
            !(token0 && token1 && priceOracle && amount0 && amount1)
          }
        >
          <span>Create AMM</span>
        </Button>
      </div>
    </Form>
  );
}
