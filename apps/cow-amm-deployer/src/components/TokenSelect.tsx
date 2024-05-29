import { toast } from "@bleu/ui";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";
import { Address, isAddress } from "viem";

import { useTokenSelect } from "#/contexts/tokenSelect";
import { IToken } from "#/lib/fetchAmmData";
import { fetchTokenInfo } from "#/lib/tokenUtils";
import { ChainId } from "#/utils/chainsPublicClients";

import { Button } from "./Button";
import { TokenInfo } from "./TokenInfo";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { FormMessage } from "./ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export function TokenSelect({
  onSelectToken,
  selectedToken,
  disabled = false,
  errorMessage,
}: {
  onSelectToken: (token: IToken) => void;
  selectedToken?: IToken;
  disabled?: boolean;
  errorMessage?: string;
}) {
  const {
    safe: { chainId },
  } = useSafeAppsSDK();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { getTokenList, addImportedToken } = useTokenSelect();

  function handleSelectToken(token: IToken) {
    onSelectToken(token);
    setOpen(false);
  }

  async function handleImportToken() {
    try {
      const importedToken = await fetchTokenInfo(
        search as Address,
        chainId as ChainId,
      );
      handleSelectToken(importedToken);
      addImportedToken(importedToken, chainId as ChainId);
      toast({
        title: "Token imported",
      });
    } catch (e) {
      toast({
        title: "Error importing token",
        variant: "destructive",
      });
    }
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="flex flex-col">
            <Button
              variant="secondary"
              type="button"
              className="px-2 justify-between border text-primary-foreground border-border bg-input hover:bg-input/20 hover:text-accent-foreground"
              disabled={disabled}
              onClick={() => setOpen(true)}
            >
              {
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                selectedToken ? (
                  <TokenInfo token={selectedToken} />
                ) : (
                  "Select Token"
                )
              }
              {!disabled && <ChevronDownIcon />}
            </Button>
            {errorMessage && (
              <FormMessage className="mt-1 h-6 text-sm text-destructive">
                <span>{errorMessage}</span>
              </FormMessage>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent>
          {/* @ts-ignore */}
          <Command
            filter={(value: string, search: string) => {
              setSearch(search);
              if (!search) return 1;
              const regex = new RegExp(search, "i");
              return Number(regex.test(value));
            }}
            value={selectedToken?.symbol}
          >
            <CommandInput />
            {/* @ts-ignore */}
            <CommandList>
              {/* @ts-ignore */}
              <CommandEmpty onSelect={handleImportToken}>
                No results found
              </CommandEmpty>
              {getTokenList(chainId as ChainId).map((token) => (
                // @ts-ignore
                <CommandItem
                  key={token.address}
                  value={token.symbol + token.address}
                  onSelect={() => handleSelectToken(token)}
                >
                  <TokenInfo
                    token={{
                      address: token.address as Address,
                      symbol: token.symbol,
                      decimals: token.decimals,
                    }}
                  />
                </CommandItem>
              ))}
              {isAddress(search) && (
                // @ts-ignore
                <CommandItem
                  key={search}
                  value={search}
                  onSelect={handleImportToken}
                >
                  Import token
                </CommandItem>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}
