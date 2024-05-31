import { formatNumber } from "@bleu/utils/formatNumber";
import { useEffect, useState } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

import { AlertCard } from "#/components/AlertCard";
import Button from "#/components/Button";
import { Spinner } from "#/components/Spinner";
import { fetchExpectedOut } from "#/lib/fetchExpectedOut";
import { PRICE_CHECKERS } from "#/lib/types";
import { ChainId } from "#/utils/chainsPublicClients";

export function PriceCheckerConfirmation({
  form,
  priceChecker,
  chainId,
  defaultValues,
  onSubmit,
}: {
  form: UseFormReturn;
  priceChecker: PRICE_CHECKERS;
  chainId: ChainId;
  defaultValues?: FieldValues;
  onSubmit: (data: FieldValues) => void;
}) {
  const {
    watch,
    handleSubmit,
    clearErrors,
    formState: { errors, isSubmitting },
  } = form;

  const data = watch();

  const [expectedOutAmount, setExpectedOut] = useState<number>();
  const [expectedOutError, setExpectedOutError] = useState(false);
  const [loadingExpectedOut, setLoadingExpectedOut] = useState(true);

  useEffect(() => {
    clearErrors();
    if (priceChecker === PRICE_CHECKERS.FIXED_MIN_OUT) {
      setExpectedOut(data.minOut);
      setLoadingExpectedOut(false);
      return;
    }
    fetchExpectedOut({
      chainId,
      priceChecker,
      data,
      sellAmount:
        defaultValues?.tokenSellAmount *
        10 ** defaultValues?.tokenSell.decimals,
      sellToken: defaultValues?.tokenSell.address,
      buyToken: defaultValues?.tokenBuy.address,
    })
      .then((expectedOut) => {
        setExpectedOut(expectedOut * (100 - data.allowedSlippageInBps));
        setLoadingExpectedOut(false);
      })
      .catch((error) => {
        setExpectedOutError(true);
        setLoadingExpectedOut(false);
        // eslint-disable-next-line no-console
        console.error(error);
      });
  }, []);

  if (loadingExpectedOut) {
    return (
      <div className="text-slate12">
        <Spinner />
      </div>
    );
  }

  if (Object.keys(errors).length || expectedOutError) {
    return (
      <AlertCard style="error" title="Error">
        Error validating the price checker. Please review the parameters.
      </AlertCard>
    );
  }
  return (
    <div className="text-slate12">
      <span>
        The price checker informed the swap of{" "}
        <b>
          {formatNumber(defaultValues?.tokenSellAmount, 4)}{" "}
          {defaultValues?.tokenSell.symbol} to{" "}
          {formatNumber(expectedOutAmount || 0, 4)}{" "}
          {defaultValues?.tokenBuy.symbol}
          {". "}
        </b>
        Note that this is an estimation based on the current market situation
        that can change on the order execution.
      </span>
      <Button
        type="submit"
        className="w-full mt-5"
        onClick={handleSubmit(onSubmit)}
        disabled={isSubmitting || !expectedOutAmount}
      >
        Confirm
      </Button>
    </div>
  );
}
