import { convertStringToNumberAndRoundDown } from "@bleu/ui";
import { formatNumber } from "@bleu/utils/formatNumber";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Address } from "viem";

import { Input } from "#/components/Input";
import { IToken } from "#/lib/fetchAmmData";
import { ammFormSchema } from "#/lib/schema";
import { fetchWalletTokenBalance } from "#/lib/tokenUtils";
import { ChainId } from "#/utils/chainsPublicClients";

export function TokenAmountInput({
  tokenFieldForm,
  form,
  fieldName,
}: {
  tokenFieldForm: "token0" | "token1";
  form: UseFormReturn<typeof ammFormSchema._type>;
  fieldName: "amount0" | "amount1";
}) {
  const {
    safe: { safeAddress, chainId },
  } = useSafeAppsSDK();
  const [walletAmount, setWalletAmount] = useState<string>("");
  const { setValue, watch, register } = form;

  const token = watch(tokenFieldForm) as IToken | undefined;

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
    updateWalletAmount(token);
  }, [token, safeAddress, chainId]);

  const maxButtonDisabled = walletAmount == "0" || !token;

  return (
    <div className="flex flex-col gap-y-1">
      <Input
        {...register(fieldName)}
        type="number"
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
