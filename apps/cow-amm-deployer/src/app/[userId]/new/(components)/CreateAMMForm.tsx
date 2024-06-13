"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Address } from "viem";
import { useAccount } from "wagmi";
import { z } from "zod";

import { Button } from "#/components";
import { AlertCard } from "#/components/AlertCard";
import { Input } from "#/components/Input";
import { PriceOracleForm } from "#/components/PriceOracleForm";
import { TokenAmountInput } from "#/components/TokenAmountInput";
import { TokenSelect } from "#/components/TokenSelect";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "#/components/ui/accordion";
import { Form } from "#/components/ui/form";
import { useManagedTransaction } from "#/hooks/tx-manager/useManagedTransaction";
import { useDebounce } from "#/hooks/useDebounce";
import { ConstantProductFactoryABI } from "#/lib/abis/ConstantProductFactory";
import { UNBALANCED_USD_DIFF_THRESHOLD } from "#/lib/constants";
import { COW_CONSTANT_PRODUCT_FACTORY } from "#/lib/contracts";
import { IToken } from "#/lib/fetchAmmData";
import { ammFormSchema } from "#/lib/schema";
import { fetchTokenUsdPrice, getNewMinTradeToken0 } from "#/lib/tokenUtils";
import { buildTxCreateAMMArgs } from "#/lib/transactionFactory";
import { cn } from "#/lib/utils";
import { ChainId, publicClientsFromIds } from "#/utils/chainsPublicClients";

export function CreateAMMForm({ userId }: { userId: string }) {
  const router = useRouter();
  const { address: safeAddress, chainId } = useAccount();

  const form = useForm<z.input<typeof ammFormSchema>>({
    // @ts-ignore
    resolver: zodResolver(ammFormSchema),
    defaultValues: {
      // TODO: this will need to be changed once we allow EOAs to create AMMs
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

  const { writeContract, writeContractWithSafe, status, isWalletContract } =
    useManagedTransaction();

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

  const onSubmit = (data: z.output<typeof ammFormSchema>) => {
    if (isWalletContract) {
      writeContractWithSafe(buildTxCreateAMMArgs({ data }));
    } else {
      // TODO: remove this once we allow EOAs to create AMMs
      // @ts-ignore
      writeContract(buildTxCreateAMMArgs({ data }));
    }
  };
  const [token0UsdPrice, setToken0UsdPrice] = useState<number>();
  const [token1UsdPrice, setToken1UsdPrice] = useState<number>();
  const [amountUsdDiff, setAmountUsdDiff] = useState<number>();
  const debouncedAmountUsdDiff = useDebounce<number | undefined>(
    amountUsdDiff,
    300,
  );

  useEffect(() => {
    setValue("safeAddress", safeAddress as string);
  }, [safeAddress, setValue]);

  async function onTxStatusFinal() {
    if (!chainId || !safeAddress || !token0 || !token1) return;
    const publicClient = publicClientsFromIds[chainId as ChainId];
    const cowAmmAddress = await publicClient.readContract({
      abi: ConstantProductFactoryABI,
      address: COW_CONSTANT_PRODUCT_FACTORY[chainId as ChainId],
      functionName: "ammDeterministicAddress",
      args: [
        safeAddress as Address,
        token0.address as Address,
        token1.address as Address,
      ],
    });
    router.push(`/${userId}/amms/${cowAmmAddress}-${userId}`);
  }

  useEffect(() => {
    if (status === "final") {
      onTxStatusFinal();
    }
  }, [status]);

  async function updateTokenUsdPrice(
    token: IToken,
    setAmountUsd: (value: number) => void,
  ) {
    const amountUsd = await fetchTokenUsdPrice({
      chainId: chainId as ChainId,
      tokenDecimals: token.decimals,
      tokenAddress: token.address as Address,
    });
    setAmountUsd(amountUsd);
  }

  useEffect(() => {
    if (token0) {
      updateTokenUsdPrice(token0, setToken0UsdPrice);
    }
  }, [token0]);

  useEffect(() => {
    if (token1) {
      updateTokenUsdPrice(token1, setToken1UsdPrice);
    }
  }, [token1]);

  useEffect(() => {
    if (token0?.address == token1?.address) return;
    if (token0UsdPrice && token1UsdPrice && amount0 && amount1) {
      const amount0Usd = amount0 * token0UsdPrice;
      const amount1Usd = amount1 * token1UsdPrice;
      setAmountUsdDiff(Math.abs(amount0Usd - amount1Usd));
    }
  }, [amount0, amount1, token0UsdPrice, token1UsdPrice]);

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
                  await getNewMinTradeToken0(token, chainId as ChainId),
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
            {/* @ts-ignore */}
            <TokenAmountInput token={token0} form={form} fieldName="amount0" />
          </div>
        </div>
        <div className="flex flex-col w-full">
          <div className="w-full flex flex-col">
            <span className="mb-2 h-5 block text-sm text-transparent" />
            {/* @ts-ignore */}
            <TokenAmountInput token={token1} form={form} fieldName="amount1" />
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
              "pt-0",
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
      {(debouncedAmountUsdDiff || 0) > UNBALANCED_USD_DIFF_THRESHOLD && (
        <AlertCard title="Unbalanced amounts" style="warning">
          <p>
            The difference between the USD value of the two token amounts is
            greater than $5000. This may lead to an unbalanced AMM and result in
            loss of funds.
          </p>
        </AlertCard>
      )}
      <div className="flex justify-center gap-x-5 mt-2">
        <Button
          loading={
            isSubmitting ||
            !["final", "idle", "confirmed", "error"].includes(status || "")
          }
          loadingText="Creating AMM..."
          variant="highlight"
          type="submit"
          className="w-full"
          disabled={!(token0 && token1 && priceOracle && amount0 && amount1)}
        >
          <span>Create AMM</span>
        </Button>
      </div>
    </Form>
  );
}
