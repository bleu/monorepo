"use client";

import { TokenInfo, TokenType } from "@gnosis.pm/safe-apps-sdk";
import { ChevronDownIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { tokenLogoUri } from "public/tokens/logoUri";
import React, { useEffect, useState } from "react";
import { formatUnits } from "viem";
import { useNetwork } from "wagmi";

import { Dialog } from "#/components/Dialog";
import Table from "#/components/Table";
import { useSafeBalances } from "#/hooks/useSafeBalances";
import { cowTokenList } from "#/utils/cowTokenList";

export interface TokenWalletBalance extends TokenInfo {
  balance: bigint;
}

export function TokenSelect({
  onSelectToken,
  tokenType,
  selectedToken,
}: {
  onSelectToken: (token: TokenWalletBalance) => void;
  tokenType: "sell" | "buy";
  selectedToken?: TokenWalletBalance;
}) {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState<TokenWalletBalance | undefined>(undefined);

  useEffect(() => {
    if (selectedToken) {
      setToken(selectedToken);
    }
  }, [selectedToken]);

  function handleSelectToken(token: TokenWalletBalance) {
    onSelectToken(token);
    setToken(token);
    setOpen(false);
  }

  return (
    <Dialog
      content={
        <TokenModal onSelectToken={handleSelectToken} tokenType={tokenType} />
      }
      isOpen={open}
      setIsOpen={setOpen}
    >
      <div className="flex flex-col">
        <span className="mb-2 block text-sm text-slate12">
          Token to {tokenType}
        </span>
        <button
          type="button"
          //same style as Input.tsx
          className="px-2w-full selection:color-white box-border flex h-[35px] w-full appearance-none items-center justify-between gap-2 rounded-[4px] bg-blue4 px-[10px] py-1 text-[15px] leading-none text-slate12 shadow-[0_0_0_1px] shadow-blue6 outline-none selection:bg-blue9 hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black] disabled:bg-blue1"
        >
          <div className="flex items-center gap-1">
            <div className="rounded-full bg-white p-[3px]">
              <Image
                src={
                  tokenLogoUri[token?.symbol as keyof typeof tokenLogoUri] ||
                  "/assets/generic-token-logo.png"
                }
                className="rounded-full"
                alt="Token Logo"
                height={22}
                width={22}
                quality={100}
              />
            </div>
            <div>{token?.symbol}</div>
          </div>
          <ChevronDownIcon />
        </button>
      </div>
    </Dialog>
  );
}

function TokenModal({
  onSelectToken,
  tokenType,
}: {
  onSelectToken: (token: TokenWalletBalance) => void;
  tokenType: "sell" | "buy";
}) {
  const { chain } = useNetwork();
  const [tokens, setTokens] = useState<(TokenWalletBalance | undefined)[]>(
    tokenType === "buy"
      ? cowTokenList
          .filter((token) => token.chainId === chain?.id)
          .map((token) => {
            return {
              address: token.address,
              decimals: token.decimals,
              name: token.name,
              symbol: token.symbol,
              logoUri: token.logoURI,
              balance: BigInt(0),
              type: TokenType.ERC20,
            };
          })
      : [],
  );

  const { assets, loaded } = useSafeBalances();
  useEffect(() => {
    if (loaded) {
      const tokens = assets.map((asset) => {
        return {
          ...asset.tokenInfo,
          balance: BigInt(asset.balance),
        };
      });

      setTokens((prevTokens) => {
        const combinedTokens = [...prevTokens, ...tokens].reduce<{
          [key: string]: TokenWalletBalance;
        }>((acc, token) => {
          const balanceBigInt = BigInt(token?.balance ?? 0);
          const address = token?.address ?? "";

          if (!acc[address] || balanceBigInt > acc[address].balance) {
            acc[address] = token as TokenWalletBalance;
          }
          return acc;
        }, {});
        return Object.values(combinedTokens);
      });
    }
  }, [loaded, assets]);

  const [tokenSearchQuery, setTokenSearchQuery] = useState("");

  function filterTokenInput({
    tokenSearchQuery,
    token,
  }: {
    tokenSearchQuery: string;
    token?: TokenInfo;
  }) {
    {
      if (!token) return false;
      const regex = new RegExp(tokenSearchQuery, "i");
      return regex.test(Object.values(token).join(","));
    }
  }
  return (
    <div className="max-h-[30rem] divide-y divide-slate7 overflow-y-scroll text-white scrollbar-thin scrollbar-track-blue3 scrollbar-thumb-slate12">
      <div className="flex h-full w-full flex-col items-center justify-center gap-y-4 py-4">
        <div className="text-xl">Token Search</div>
        <div className="flex w-full items-center px-10">
          <input
            type="text"
            placeholder="Search name or paste address"
            className="h-9 w-full appearance-none items-center justify-center rounded-l-[4px] bg-blue4 px-[10px] text-sm leading-none text-slate12 outline-none"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTokenSearchQuery(e.target.value)
            }
            value={tokenSearchQuery}
          />
          <div className="flex items-center h-9 rounded-r-[4px] bg-slate12 px-2 leading-none outline-none transition hover:bg-slate11 disabled:cursor-not-allowed">
            <MagnifyingGlassIcon
              color="rgb(31 41 55)"
              className="font-semibold"
              height={20}
              width={20}
            />
          </div>
        </div>
      </div>
      <Table color="blue">
        <Table.HeaderRow>
          <Table.HeaderCell>
            <span className="sr-only">Token Logo</span>
          </Table.HeaderCell>
          <Table.HeaderCell>Token</Table.HeaderCell>
          <Table.HeaderCell>Wallet Balance</Table.HeaderCell>
        </Table.HeaderRow>
        <Table.Body>
          {tokens
            .filter((token) => filterTokenInput({ tokenSearchQuery, token }))
            .sort((a, b) =>
              formatUnits(a!.balance, a!.decimals ? a!.decimals : 0) <
              formatUnits(b!.balance, b!.decimals ? b!.decimals : 0)
                ? 1
                : -1,
            )
            .map((token) => {
              if (token) {
                return (
                  <TokenRow
                    key={token.address}
                    token={token}
                    onSelectToken={onSelectToken}
                  />
                );
              }
            })}
        </Table.Body>
      </Table>
    </div>
  );
}

function TokenRow({
  token,
  onSelectToken,
}: {
  token: TokenWalletBalance;
  onSelectToken: (token: TokenWalletBalance) => void;
}) {
  return (
    <Table.BodyRow
      key={token.address}
      classNames="hover:bg-blue4 hover:cursor-pointer"
      onClick={() => onSelectToken(token)}
    >
      <Table.BodyCell customWidth="w-12">
        <div className="flex items-center justify-center">
          <div className="rounded-full bg-white p-1">
            <Image
              src={
                tokenLogoUri[token.symbol as keyof typeof tokenLogoUri] ||
                "/assets/generic-token-logo.png"
              }
              className="rounded-full"
              alt="Token Logo"
              height={28}
              width={28}
              quality={100}
            />
          </div>
        </div>
      </Table.BodyCell>
      <Table.BodyCell>{token.symbol}</Table.BodyCell>
      <Table.BodyCell>
        {token.balance
          ? formatUnits(token.balance, token.decimals ? token.decimals : 0)
          : ""}
      </Table.BodyCell>
    </Table.BodyRow>
  );
}
