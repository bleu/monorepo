import { getStableSwapSimulatorTokensSchema } from "@balancer-pool-metadata/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";

import Button from "#/components/Button";
import { Input } from "#/components/Input";
import { TokensData, useStableSwap } from "#/contexts/StableSwapContext";

export default function TokenForm({
  symbolToEdit,
  close,
}: {
  symbolToEdit?: string;
  close?: () => void;
}) {
  const { baselineData, setBaselineData } = useStableSwap();
  const stableSwapTokensSchema = getStableSwapSimulatorTokensSchema({
    symbolToEdit,
    existentSymbols: baselineData?.tokens?.map((token: TokensData) => {
      return token.symbol;
    }),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<typeof stableSwapTokensSchema._type>({
    resolver: zodResolver(stableSwapTokensSchema),
  });

  const currentToken =
    baselineData?.tokens?.find(
      (token: TokensData) => token.symbol == symbolToEdit
    ) || undefined;

  const validateUniqueSymbol = (symbol: string) => {
    const tokensToCheck = baselineData?.tokens?.filter(
      (token: TokensData) => token.symbol != symbolToEdit
    );
    const symbolsToCheck = tokensToCheck?.map(
      (token: TokensData) => token.symbol
    );
    if (symbolsToCheck?.includes(symbol)) {
      return "This symbol already exists. Please define another name.";
    }
    return true;
  };

  function addOrEditToken(data: TokensData) {
    if (symbolToEdit) {
      setBaselineData({
        ...baselineData,
        tokens: baselineData?.tokens?.map((token: TokensData) => {
          if (token.symbol == symbolToEdit) {
            return {
              ...data,
            };
          }
          return token;
        }),
      });
    } else {
      setBaselineData({
        ...baselineData,
        tokens: [
          ...(baselineData?.tokens || []),
          {
            ...data,
          },
        ],
      });
    }
    close?.();
  }

  return (
    <form onSubmit={handleSubmit(addOrEditToken)} id="token-form">
      <div className="flex flex-col gap-y-4">
        <Input
          label="Symbol"
          placeholder="Define the token symbol"
          defaultValue={currentToken?.symbol}
          {...register("symbol", {
            required: true,
            validate: validateUniqueSymbol,
          })}
          errorMessage={errors?.symbol?.message?.toString() || ""}
        />
        <Input
          label="Balance"
          placeholder="Define the token balance"
          defaultValue={currentToken?.balance}
          {...register("balance", {
            valueAsNumber: true,
            min: 0,
            required: true,
          })}
          errorMessage={errors?.balance?.message?.toString() || ""}
        />
        <Input
          label="Rate"
          placeholder="Define the token price rate"
          defaultValue={currentToken?.rate}
          {...register("rate", {
            valueAsNumber: true,
            min: 0,
            required: true,
          })}
          errorMessage={errors?.rate?.message?.toString() || ""}
        />
      </div>
      <div className="mt-4 flex items-center justify-end gap-3">
        <Dialog.Close asChild>
          <Button shade="light" variant="outline">
            Cancel
          </Button>
        </Dialog.Close>
        <Button form="token-form" type="submit" shade="light">
          Add
        </Button>
      </div>
    </form>
  );
}
