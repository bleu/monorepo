import { convertStringToNumberAndRoundDown } from "@bleu/ui";
import { formatNumber } from "@bleu/utils/formatNumber";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Address } from "viem";

import { Input } from "#/components/Input";
import { IToken } from "#/lib/fetchAmmData";
import { fetchWalletTokenBalance } from "#/lib/tokenUtils";
import { ChainId } from "#/utils/chainsPublicClients";

type tokenAmountForm = {
  amount0: number;
  amount1: number;
};

export function TokenAmountInput({
  token,
  form,
  fieldName,
  defaultWalletAmount,
}: {
  token: IToken | undefined;
  form: UseFormReturn<tokenAmountForm>;
  fieldName: "amount0" | "amount1";
  defaultWalletAmount?: string;
}) {
  const {
    safe: { safeAddress, chainId },
  } = useSafeAppsSDK();
  const [walletAmount, setWalletAmount] = useState<string>(
    defaultWalletAmount || ""
  );
  const { setValue, register } = form;

  async function updateWalletAmount(token: IToken) {
    const updatedWalletAmount = await fetchWalletTokenBalance({
      token,
      walletAddress: safeAddress as Address,
      chainId: chainId as ChainId,
    });
    setWalletAmount(updatedWalletAmount);
  }

  useEffect(() => {
    if (!token) return;
    if (defaultWalletAmount) return;
    updateWalletAmount(token);
  }, [token, safeAddress, chainId, defaultWalletAmount]);

  const maxButtonDisabled = walletAmount == "0" || !token;

  return (
    <div className="flex flex-col gap-y-1 w-full">
      <Input
        {...register(fieldName)}
        type="number"
        className="w-full"
        step={1 / 10 ** (token ? token.decimals : 18)}
      />
      <div className="flex gap-x-1 text-xs">
        <span>
          <span>
            Wallet Balance:{" "}
            {formatNumber(walletAmount, 4, "decimal", "standard", 0.0001)}
          </span>
        </span>
        {!maxButtonDisabled && (
          <button
            type="button"
            className="text-accent outline-none hover:text-accent/70"
            onClick={() => {
              setValue(
                fieldName,
                convertStringToNumberAndRoundDown(walletAmount)
              );
            }}
          >
            Max
          </button>
        )}
      </div>
    </div>
  );
}
