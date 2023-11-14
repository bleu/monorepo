import { Address } from "@bleu-fi/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { createPublicClient, http } from "viem";
import { goerli } from "viem/chains";

import { TransactionStatus } from "#/app/milkman/utils/type";
import { Input } from "#/components/Input";
import { Select, SelectItem } from "#/components/Select";
import { Form, FormMessage } from "#/components/ui/form";
import { Label } from "#/components/ui/label";
import { PRICE_CHECKERS, priceCheckerInfoMapping } from "#/lib/priceCheckers";

import { FormFooter } from "./Footer";

export function FormSelectPriceChecker({
  onSubmit,
  defaultValues,
  tokenSellAddress,
  tokenBuyAddress,
}: {
  onSubmit: (data: FieldValues) => void;
  defaultValues?: FieldValues;
  tokenSellAddress: Address;
  tokenBuyAddress: Address;
}) {
  const [selectedPriceChecker, setSelectedPriceChecker] =
    useState<PRICE_CHECKERS>(defaultValues?.priceChecker);

  const publicClient = createPublicClient({
    chain: goerli,
    transport: http(),
  });

  const schema =
    selectedPriceChecker &&
    priceCheckerInfoMapping[selectedPriceChecker].getSchema({
      tokenSellAddress,
      tokenBuyAddress,
      publicClient,
    });

  const form = useForm(
    selectedPriceChecker && {
      resolver: zodResolver(schema),
      mode: "onSubmit",
    },
  );

  const {
    register,
    clearErrors,
    setValue,
    formState: { errors },
  } = form;

  useEffect(() => {
    clearErrors();
    register("priceChecker");
    register("priceCheckerAddress");
    if (!selectedPriceChecker) {
      return;
    }
    setValue("priceChecker", selectedPriceChecker);
    setValue(
      "priceCheckerAddress",
      priceCheckerInfoMapping[selectedPriceChecker].addresses[goerli.id],
    );
  }, [selectedPriceChecker]);

  return (
    <Form {...form} onSubmit={onSubmit} className="flex flex-col gap-y-6 p-9">
      <div className="mb-2">
        <Label>Price checker</Label>
        <Select
          onValueChange={(priceChecker) => {
            setSelectedPriceChecker(priceChecker as PRICE_CHECKERS);
          }}
          className="w-full mt-2"
          defaultValue={defaultValues?.priceChecker}
        >
          {Object.values(PRICE_CHECKERS).map((priceChecker) => (
            <SelectItem value={priceChecker} key={priceChecker}>
              {priceChecker}
            </SelectItem>
          ))}
        </Select>
        {errors.priceChecker && (
          <FormMessage className="h-6 text-sm text-tomato10 w-full">
            <span>{errors.priceChecker.message as string}</span>
          </FormMessage>
        )}
      </div>
      {selectedPriceChecker &&
        priceCheckerInfoMapping[
          selectedPriceChecker as PRICE_CHECKERS
        ].arguments.map((arg) => (
          <Input
            type={arg.inputType}
            label={arg.label}
            key={arg.name}
            defaultValue={defaultValues?.[arg.name]}
            {...register(arg.name)}
          />
        ))}
      <FormFooter
        transactionStatus={TransactionStatus.ORDER_STRATEGY}
        disabled={!selectedPriceChecker}
      />
    </Form>
  );
}
