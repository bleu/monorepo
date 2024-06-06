"use client";

import { toast } from "@bleu/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Address, formatUnits } from "viem";
import { z } from "zod";

import { Button } from "#/components";
import { Input } from "#/components/Input";
import { PriceOracleForm } from "#/components/PriceOracleForm";
import { TokenInfo } from "#/components/TokenInfo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "#/components/ui/accordion";
import { Form } from "#/components/ui/form";
import { useRawTxData } from "#/hooks/useRawTxData";
import { ICowAmm } from "#/lib/fetchAmmData";
import { ammEditSchema } from "#/lib/schema";
import { buildTxEditAMMArgs } from "#/lib/transactionFactory";
import { cn } from "#/lib/utils";

export function EditAMMForm({
  cowAmmData,
  submitButtonText,
}: {
  cowAmmData: ICowAmm;
  submitButtonText: string;
}) {
  const router = useRouter();

  const form = useForm<z.input<typeof ammEditSchema>>({
    // @ts-ignore
    resolver: zodResolver(ammEditSchema),
    defaultValues: {
      safeAddress: cowAmmData.user.address,
      chainId: cowAmmData.chainId,
      token0: cowAmmData.token0,
      token1: cowAmmData.token1,
      minTradedToken0: Number(
        formatUnits(cowAmmData.minTradedToken0, cowAmmData.token0.decimals)
      ),
      priceOracleSchema: cowAmmData.decodedPriceOracleData,
    },
  });

  const {
    formState: { errors, isSubmitting },
  } = form;
  const { sendTransactions } = useRawTxData();

  const onSubmit = async (data: typeof ammEditSchema._type) => {
    const txArgs = buildTxEditAMMArgs({
      data: data,
      ammAddress: cowAmmData.order.owner as Address,
    });

    try {
      await sendTransactions(txArgs);
      router.push(`/${cowAmmData.user.id}/amms/${cowAmmData.id}`);
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
      <div className="flex flex-col w-full">
        <span className="mb-2 h-5 block text-sm">Token Pair</span>
        <div className="flex h-fit gap-x-7">
          <TokenInfo token={cowAmmData.token0} />
          <TokenInfo token={cowAmmData.token1} />
        </div>
      </div>
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
              step={10 ** -cowAmmData.token0.decimals}
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
          disabled={isSubmitting}
        >
          <span>{submitButtonText}</span>
        </Button>
      </div>
    </Form>
  );
}