"use client";

import { toast } from "@bleu/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlayIcon } from "@radix-ui/react-icons";
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
import { useManagedTransaction } from "#/hooks/tx-manager/useManagedTransaction";
import { ICowAmm } from "#/lib/fetchAmmData";
import { ammEditSchema } from "#/lib/schema";
import { buildTxEditAMMArgs } from "#/lib/transactionFactory";
import { cn } from "#/lib/utils";

import { DisableAmmButton } from "./DisableAmmButton";

export function EditAMMForm({ ammData }: { ammData: ICowAmm }) {
  const form = useForm<z.input<typeof ammEditSchema>>({
    // @ts-ignore
    resolver: zodResolver(ammEditSchema),
    defaultValues: {
      safeAddress: ammData.user.address,
      chainId: ammData.chainId,
      token0: ammData.token0,
      token1: ammData.token1,
      minTradedToken0: Number(
        formatUnits(ammData.minTradedToken0, ammData.token0.decimals),
      ),
      priceOracleSchema: ammData.decodedPriceOracleData,
    },
  });

  const {
    formState: { errors, isSubmitting },
  } = form;

  const { writeContract, writeContractWithSafe, status, isWalletContract } =
    useManagedTransaction();

  const onSubmit = async (data: typeof ammEditSchema._type) => {
    const txArgs = buildTxEditAMMArgs({
      data: data,
      ammAddress: ammData.order.owner as Address,
    });

    try {
      if (isWalletContract) {
        writeContractWithSafe(txArgs);
      } else {
        // TODO: this will need to be refactored once we have EOAs
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

  const submitButtonText = ammData.disabled ? "Enable AMM" : "Update AMM";

  return (
    // @ts-ignore
    <Form {...form} onSubmit={onSubmit} className="flex flex-col gap-y-5">
      <div className="flex flex-col w-full">
        <span className="mb-2 h-5 block text-sm">Token Pair</span>
        <div className="flex h-fit gap-x-7">
          <TokenInfo token={ammData.token0} />
          <TokenInfo token={ammData.token1} />
        </div>
      </div>
      <PriceOracleForm form={form} />
      <Accordion className="w-full" type="single" collapsible>
        <AccordionItem value="advancedOptions" key="advancedOption">
          <AccordionTrigger
            className={cn(
              errors.minTradedToken0 ? "text-destructive" : "",
              "pt-0",
            )}
          >
            Advanced Options
          </AccordionTrigger>
          <AccordionContent>
            <Input
              label="Minimum first token amount on each order"
              type="number"
              step={10 ** -ammData.token0.decimals}
              name="minTradedToken0"
              tooltipText="This parameter is used to not overload the CoW Orderbook with small orders. By default, 10 dollars worth of the first token will be the minimum amount for each order."
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex space-x-2 space-between mt-2">
        {!ammData.disabled && <DisableAmmButton ammData={ammData} />}
        <Button
          loading={
            isSubmitting ||
            !["final", "idle", "confirmed", "error"].includes(status || "")
          }
          variant={ammData.disabled ? "default" : "highlight"}
          type="submit"
          disabled={isSubmitting || ammData.version !== "Standalone"}
          loadingText="Confirming..."
        >
          {ammData.disabled ? <PlayIcon className="mr-1" /> : ""}
          <span>{submitButtonText}</span>
        </Button>
      </div>
    </Form>
  );
}
