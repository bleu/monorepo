"use client";

import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { TokenBalance, TokenType } from "@gnosis.pm/safe-apps-sdk";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import { erc20ABI } from "@wagmi/core";
import Image from "next/image";
import { tokenLogoUri } from "public/tokens/logoUri";
import React, { useEffect, useState } from "react";
import { formatUnits, isAddress } from "viem";

import { Button } from "#/components";
import { Dialog } from "#/components/Dialog";
import Table from "#/components/Table";
import { Toast } from "#/components/Toast";
import { useSafeBalances } from "#/hooks/useSafeBalances";
import { IToken } from "#/lib/types";
import { ChainId, publicClientsFromIds } from "#/utils/chainsPublicClients";

export function TokenSelect({
  onSelectToken,
  selectedToken,
  label,
  disabeld = false,
}: {
  onSelectToken: (token: IToken) => void;
  selectedToken?: IToken;
  label?: string;
  disabeld?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState<IToken | undefined>(undefined);

  useEffect(() => {
    if (selectedToken) {
      setToken(selectedToken);
    }
  }, [selectedToken]);

  function handleSelectToken(token: TokenBalance) {
    const tokenForPriceChecker = {
      address: token.tokenInfo.address,
      symbol: token.tokenInfo.symbol,
      decimals: token.tokenInfo.decimals,
    };
    onSelectToken(tokenForPriceChecker);
    setToken(tokenForPriceChecker);
    setOpen(false);
  }

  return (
    <Dialog
      content={<TokenModal onSelectToken={handleSelectToken} />}
      isOpen={open}
      setIsOpen={setOpen}
    >
      <TokenSelectButton
        label={label}
        token={token}
        disabeld={disabeld}
        onClick={() => setOpen(true)}
      />
    </Dialog>
  );
}

export function TokenSelectButton({
  label,
  token,
  onClick,
  disabeld = false,
}: {
  label?: string;
  token?: IToken;
  disabeld?: boolean;
  onClick?: () => void;
}) {
  return (
    <div className="flex flex-col w-full">
      <span className="mb-2 h-5 block text-sm">{label}</span>
      <button
        type="button"
        //same style as Input.tsx
        className="px-2w-full selection:color-white box-border flex h-[35px] w-full appearance-none items-center justify-between gap-2 rounded-[4px] bg-darkBrown px-[10px] py-1 text-[15px] leading-none text-seashell shadow-[0_0_0_1px] shadow-brown6 outline-none selection:bg-brown9 hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black] disabled:bg-brown1"
        disabled={disabeld}
        onClick={onClick}
      >
        <div className="flex items-center gap-1">
          <div className="rounded-full bg-beige p-[3px]">
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
        {!disabeld && <ChevronDownIcon />}
      </button>
    </div>
  );
}

function TokenModal({
  onSelectToken,
}: {
  onSelectToken: (token: TokenBalance) => void;
}) {
  const {
    safe: { chainId, safeAddress },
  } = useSafeAppsSDK();
  const [tokens, setTokens] = useState<(TokenBalance | undefined)[]>([]);

  const { assets, loaded } = useSafeBalances();
  useEffect(() => {
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
  }, [loaded, assets]);

  const [tokenSearchQuery, setTokenSearchQuery] = useState("");
  const [isNotifierOpen, setIsNotifierOpen] = useState(false);
  const publicClient = publicClientsFromIds[chainId as ChainId];

  function filterTokenInput({
    tokenSearchQuery,
    token,
  }: {
    tokenSearchQuery: string;
    token?: TokenBalance;
  }) {
    {
      if (!token) return false;
      const regex = new RegExp(tokenSearchQuery, "i");
      return regex.test(Object.values(token.tokenInfo).join(","));
    }
  }

  async function manuallyImportToken() {
    if (!isAddress(tokenSearchQuery)) {
      setIsNotifierOpen(true);
      return;
    }

    const tokensContracts = ["name", "symbol", "decimals", "balanceOf"].map(
      (functionName) => ({
        abi: erc20ABI,
        address: tokenSearchQuery,
        functionName: functionName,
        args: functionName === "balanceOf" ? [safeAddress] : [],
      }),
    );

    const data = await publicClient.multicall({ contracts: tokensContracts });

    if (data.some((result) => result.error) || !data[3].result) {
      setIsNotifierOpen(true);
      return;
    }

    const token = {
      balance: "0",
      fiatBalance: "0",
      fiatConversion: "0",
      tokenInfo: {
        chainId: chainId as ChainId,
        address: tokenSearchQuery,
        decimals: data[2].result as number,
        name: data[0].result as string,
        symbol: data[1].result as string,
        logoUri: "/assets/generic-token-logo.png",
        type: TokenType.ERC20,
      },
    };

    setTokens((prevTokens) => [token, ...prevTokens]);
  }
  return (
    <div className="max-h-[30rem] divide-y divide-slate7 overflow-y-scroll text-seashell scrollbar-thin scrollbar-track-brown3 scrollbar-thumb-beige">
      <div className="flex h-full w-full flex-col items-center justify-center gap-y-4 py-4">
        <div className="text-xl">Token Search</div>
        <div className="flex w-full items-center px-10">
          <input
            type="text"
            placeholder="Search name or paste address"
            className="h-9 w-full appearance-none items-center justify-center rounded-l-[4px] bg-darkBrown px-[10px] text-sm leading-none text-slate12 outline-none"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTokenSearchQuery(e.target.value)
            }
            value={tokenSearchQuery}
          />
          <div className="flex items-center h-9 rounded-r-[4px] bg-slate12 px-2 leading-none outline-none transition disabled:cursor-not-allowed">
            <MagnifyingGlassIcon
              color="rgb(31 41 55)"
              className="font-semibold"
              height={20}
              width={20}
            />
          </div>
          <Button className="mx-2 p-2" onClick={manuallyImportToken}>
            <PlusIcon />
          </Button>
        </div>
      </div>
      <Table color="beige" classNames="text-darkBrown">
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
              formatUnits(
                BigInt(a!.balance),
                a!.tokenInfo.decimals ? a!.tokenInfo.decimals : 0,
              ) <
              formatUnits(
                BigInt(b!.balance),
                b!.tokenInfo.decimals ? b!.tokenInfo.decimals : 0,
              )
                ? 1
                : -1,
            )
            .map((token) => {
              if (token) {
                return (
                  <TokenRow
                    key={token.tokenInfo.address}
                    token={token}
                    onSelectToken={onSelectToken}
                  />
                );
              }
            })}
        </Table.Body>
      </Table>
      <Toast
        content={<ToastContent />}
        isOpen={isNotifierOpen}
        setIsOpen={setIsNotifierOpen}
        duration={5000}
        variant="alert"
      />
    </div>
  );
}

function ToastContent() {
  return (
    <div className="flex h-14 flex-row items-center justify-between px-4 py-8">
      <div className="flex flex-col justify-between space-y-1 text-slate11">
        Error: Check if the address is correct or if you really have this token.
      </div>
    </div>
  );
}

function TokenRow({
  token,
  onSelectToken,
}: {
  token: TokenBalance;
  onSelectToken: (token: TokenBalance) => void;
}) {
  return (
    <Table.BodyRow
      key={token.tokenInfo.address}
      classNames="hover:bg-brown9 hover:cursor-pointer"
      onClick={() => onSelectToken(token)}
    >
      <Table.BodyCell customWidth="w-12">
        <div className="flex items-center justify-center">
          <div className="rounded-full bg-white p-1">
            <Image
              src={
                tokenLogoUri[
                  token.tokenInfo.symbol as keyof typeof tokenLogoUri
                ] || "/assets/generic-token-logo.png"
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
      <Table.BodyCell>{token.tokenInfo.symbol}</Table.BodyCell>
      <Table.BodyCell>
        {token.balance
          ? formatUnits(
              BigInt(token.balance),
              token.tokenInfo.decimals ? token.tokenInfo.decimals : 0,
            )
          : ""}
      </Table.BodyCell>
    </Table.BodyRow>
  );
}
