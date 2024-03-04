/* eslint-disable tailwindcss/no-custom-classname */
import { TokenBalance } from "@gnosis.pm/safe-apps-sdk";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { tokenLogoUri } from "public/tokens/logoUri";
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
import { Toast } from "./Toast";

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
    undefined
  );
  const [isNotifierOpen, setIsNotifierOpen] = useState(false);

  // const {
  //   safe: { chainId, safeAddress },
  // } = useSafeAppsSDK();

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
  // const [tokenSearchQuery, setTokenSearchQuery] = useState("");
  // const [isNotifierOpen, setIsNotifierOpen] = useState(false);
  // const publicClient = publicClientsFromIds[chainId as ChainId];

  function handleSelectToken(token: TokenBalance) {
    const tokenForPriceChecker = {
      address: token.tokenInfo.address,
      symbol: token.tokenInfo.symbol,
      decimals: token.tokenInfo.decimals,
    };
    onSelectToken(tokenForPriceChecker);
    setSelectedValue(tokenForPriceChecker);
    setOpen(false);
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
            className="justify-start px-2 justify-between"
            disabled={disabled}
            onClick={() => setOpen(true)}
          >
            <div className="flex items-center gap-1">
              <div className="rounded-full bg-input p-[3px]">
                <Image
                  src={
                    tokenLogoUri[
                      selectedValue?.symbol as keyof typeof tokenLogoUri
                    ] || "/assets/generic-token-logo.png"
                  }
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
                  <Image
                    src={
                      tokenLogoUri[
                        token.tokenInfo.symbol as keyof typeof tokenLogoUri
                      ] || "/assets/generic-token-logo.png"
                    }
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
      <Toast
        content={<ToastContent />}
        isOpen={isNotifierOpen}
        setIsOpen={setIsNotifierOpen}
        duration={5000}
        variant="alert"
      />
    </>
  );
}

function ToastContent() {
  return (
    <div className="flex h-14 flex-row items-center justify-between px-4 py-8">
      <div className="flex flex-col justify-between space-y-1 text-primary-foreground">
        Error: Check if the address is correct or if you really have this token.
      </div>
    </div>
  );
}
