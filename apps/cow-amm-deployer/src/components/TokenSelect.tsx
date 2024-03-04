/* eslint-disable tailwindcss/no-custom-classname */
import { TokenBalance } from "@gnosis.pm/safe-apps-sdk";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import React, { useEffect, useState } from "react";

import { Command, CommandInput, CommandItem } from "#/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "#/components/ui/popover";
import { useSafeBalances } from "#/hooks/useSafeBalances";
import { IToken } from "#/lib/types";

import { Button } from "./Button";
import { ImageFallback } from "./ImageFallback";

export function TokenSelect({
  onSelectToken,
  selectedToken,
  disabled = false,
}: {
  onSelectToken: (token: IToken) => void;
  selectedToken?: IToken;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [tokens, setTokens] = useState<TokenBalance[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedValue, setSelectedValue] = useState<IToken | undefined>(
    undefined,
  );
  const [tokenUri, setTokenUri] = useState<string>();

  const { assets, loaded } = useSafeBalances();

  useEffect(() => {
    if (selectedToken) {
      setSelectedValue(selectedToken);
    }

    if (loaded) {
      const tokens = assets.map((asset) => {
        return {
          ...asset,
        };
      });

      setTokens((prevTokens) => {
        const combinedTokens = [...prevTokens, ...tokens].reduce<{
          [key: string]: TokenBalance;
        }>((acc, token) => {
          const balanceBigInt = BigInt(token?.balance ?? 0);
          const address = token?.tokenInfo?.address ?? "";

          if (!acc[address] || balanceBigInt > BigInt(acc[address].balance)) {
            acc[address] = token as TokenBalance;
          }
          return acc;
        }, {});
        return Object.values(combinedTokens);
      });
    }
  }, [selectedToken, loaded, assets]);

  useEffect(() => {
    if (selectedToken) {
      const asset = assets.find(
        (asset) =>
          asset.tokenInfo.address.toLowerCase() ===
          selectedToken.address.toLowerCase(),
      );
      setTokenUri(asset?.tokenInfo.logoUri);
    }
  }, [assets]);

  function handleSelectToken(token: TokenBalance) {
    const tokenForPriceChecker = {
      address: token.tokenInfo.address,
      symbol: token.tokenInfo.symbol,
      decimals: token.tokenInfo.decimals,
    };
    onSelectToken(tokenForPriceChecker);
    setSelectedValue(tokenForPriceChecker);
    setOpen(false);
    setTokenUri(token.tokenInfo.logoUri);
  }

  function filterTokens(token: TokenBalance) {
    if (!searchQuery) return true;
    const regex = new RegExp(searchQuery, "i");
    return regex.test(token.tokenInfo.symbol);
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            type="button"
            className="px-2 justify-between"
            disabled={disabled}
            onClick={() => setOpen(true)}
          >
            <div className="flex items-center gap-1">
              <div className="rounded-full bg-input p-[3px]">
                <ImageFallback
                  src={tokenUri}
                  fallbackSrc="/assets/generic-token-logo.png"
                  className="rounded-full"
                  alt="Token Logo"
                  height={22}
                  width={22}
                  quality={100}
                />
              </div>
              <div>{selectedValue?.symbol || "Select Token"}</div>
            </div>
            {!disabled && <ChevronDownIcon />}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Command>
            <CommandInput
              placeholder="Search token..."
              className="h-9"
              // @ts-expect-error
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {tokens.filter(filterTokens).map((token) => (
              <CommandItem
                key={token.tokenInfo.address}
                onSelect={() => handleSelectToken(token)}
              >
                <div className="flex items-center">
                  <ImageFallback
                    src={token.tokenInfo.logoUri}
                    fallbackSrc="/assets/generic-token-logo.png"
                    alt="Token Logo"
                    height={22}
                    width={22}
                  />
                  <span className="ml-2">{token.tokenInfo.symbol}</span>
                </div>
              </CommandItem>
            ))}
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}
