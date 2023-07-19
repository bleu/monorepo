"use client";

import { SingleInternalBalanceQuery } from "@bleu-balancer-tools/gql/src/balancer-internal-manager/__generated__/Ethereum";
import {
  Address,
  addressRegex,
  buildBlockExplorerTokenURL,
} from "@bleu-balancer-tools/shared";
import { ChevronDownIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { erc20ABI, fetchBalance, multicall } from "@wagmi/core";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { tokenLogoUri } from "public/tokens/logoUri";
import React, { useEffect, useState } from "react";
import { formatUnits } from "viem";
import { useAccount, useNetwork } from "wagmi";

import genericTokenLogo from "#/assets/generic-token-logo.png";
import { Dialog } from "#/components/Dialog";
import Table from "#/components/Table";
import { useInternalBalance } from "#/contexts/InternalManagerContext";
import { getNetwork } from "#/contexts/networks";
import { internalBalances } from "#/lib/gql";
import { refetchRequest } from "#/utils/fetcher";
import { ArrElement, GetDeepProp } from "#/utils/getTypes";

interface TokenWalletBalance {
  tokenAddress: string;
  value: bigint;
  symbol: string | null | undefined;
  decimals: number | undefined;
}

interface TokenItem extends TokenWalletBalance {
  internalBalance?: string | null;
}

export function TokenSelect({
  token,
  operationKind,
}: {
  token?: ArrElement<
    GetDeepProp<SingleInternalBalanceQuery, "userInternalBalances">
  >;
  operationKind: string;
}) {
  return (
    <Dialog
      content={<TokenModal operationKind={operationKind} />}
      customWidth="w-8/12"
      noPadding
    >
      <div className="flex flex-col">
        <span className="mb-2 block text-sm text-slate12">Token</span>
        <button
          type="button"
          className="px-2w-full selection:color-white box-border flex h-[35px] w-full appearance-none items-center justify-between gap-2 rounded-[4px] bg-blue4 px-[10px] py-1 text-[15px] leading-none text-slate12 shadow-[0_0_0_1px] shadow-blue6 outline-none selection:bg-blue9 hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black] disabled:bg-blue1"
        >
          <div className="flex items-center gap-1">
            <Image
              src={
                tokenLogoUri[
                  token?.tokenInfo?.symbol as keyof typeof tokenLogoUri
                ] || genericTokenLogo
              }
              className="rounded-full"
              alt="Token Logo"
              height={22}
              width={22}
              quality={100}
            />
            <div>{token?.tokenInfo.symbol}</div>
          </div>
          <ChevronDownIcon />
        </button>
      </div>
    </Dialog>
  );
}

function TokenModal({
  operationKind,
}: {
  close?: () => void;
  operationKind: string;
}) {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const [tokens, setTokens] = useState<(TokenItem | undefined)[]>([]);
  const [tokenSearchQuery, setTokenSearchQuery] = useState("");
  const [isTokenSearchDisabled, setIsTokenSearchDisabled] =
    useState<boolean>(true);

  const addressLower = address ? address?.toLowerCase() : "";

  const { tokenList } = useInternalBalance();

  const { data: internalBalanceData, mutate } = internalBalances
    .gql(chain?.id.toString() || "1")
    .useInternalBalance({
      userAddress: addressLower as Address,
    });

  refetchRequest({
    mutate,
    chainId: chain?.id.toString() || "1",
    userAddress: addressLower as Address,
  });

  const internalBalancesTokenAdresses = internalBalanceData?.user
    ?.userInternalBalances
    ? internalBalanceData.user.userInternalBalances.map((token) =>
        token.tokenInfo.address.toLowerCase(),
      )
    : [];

  const tokenListAdresses = tokenList
    ? tokenList.map((token) => token.address.toLowerCase())
    : [];

  const tokenAdresses = [
    ...new Set([...internalBalancesTokenAdresses, ...tokenListAdresses]),
  ];

  async function fetchSingleTokenBalance({
    tokenAddress,
  }: {
    tokenAddress: Address;
  }) {
    const tokenData = await fetchBalance({
      address: addressLower as Address,
      token: tokenAddress,
    });
    return tokenData;
  }
  async function getWalletBalance(tokenAdresses: Address[]) {
    const tokensContracts = tokenAdresses.map((tokenAddress) => ({
      abi: erc20ABI,
      address: tokenAddress,
      functionName: "balanceOf",
      args: [addressLower],
    }));
    const data = await multicall({ contracts: tokensContracts });
    const walletBalanceData = tokenAdresses.map((tokenAddress, index) => {
      const token = tokenList.find(
        (obj) => obj.address.toLowerCase() === tokenAddress.toLowerCase(),
      );
      const { result } = data[index];
      return {
        tokenAddress,
        value: result as bigint,
        symbol: token?.symbol,
        decimals: token?.decimals,
      };
    });

    if (walletBalanceData) {
      setTokens([]);
      walletBalanceData.forEach((token) => {
        const internalBalance =
          internalBalanceData?.user?.userInternalBalances?.find(
            (internalBalanceInfo) =>
              internalBalanceInfo.tokenInfo.address === token.tokenAddress,
          );

        if (internalBalance) {
          setTokens((prev) => [
            ...prev,
            {
              symbol: internalBalance.tokenInfo.symbol,
              decimals: internalBalance.tokenInfo.decimals,
              tokenAddress: internalBalance.tokenInfo.address,
              internalBalance: internalBalance.balance,
              value: token.value,
            },
          ]);
        } else {
          setTokens((prev) => [
            ...prev,
            {
              ...token,
            },
          ]);
        }
      });
    }
  }

  const tokenExplorerUrl = buildBlockExplorerTokenURL({
    chainId: chain?.id,
    tokenAddress: tokenSearchQuery.toLowerCase() as Address,
  });

  useEffect(() => {
    getWalletBalance(tokenAdresses as Address[]);
  }, [internalBalanceData]);

  const network = getNetwork(chain?.name);
  useEffect(() => {
    if (!addressRegex.test(tokenSearchQuery)) {
      setIsTokenSearchDisabled(true);
      return;
    }
    setIsTokenSearchDisabled(false);
    if (
      !tokens.some((token) => filterTokenInput({ tokenSearchQuery, token }))
    ) {
      fetchSingleTokenBalance({
        tokenAddress: tokenSearchQuery.toLowerCase() as Address,
      }).then((tokenData) => {
        setTokens((prev) => [
          ...prev,
          {
            value: tokenData.value,
            symbol: tokenData.symbol,
            decimals: tokenData.decimals,
            tokenAddress: tokenSearchQuery.toLowerCase() as Address,
          },
        ]);
      });
    }
  }, [tokenSearchQuery]);

  function filterTokenInput({
    tokenSearchQuery,
    token,
  }: {
    tokenSearchQuery: string;
    token?: TokenItem;
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
          {isTokenSearchDisabled ? (
            <button
              className="h-9 rounded-r-[4px] bg-slate12 px-2 leading-none outline-none transition hover:bg-slate11 disabled:cursor-not-allowed"
              disabled={isTokenSearchDisabled}
            >
              <MagnifyingGlassIcon
                color="rgb(31 41 55)"
                className="ml-1 font-semibold"
                height={20}
                width={20}
              />
            </button>
          ) : (
            <a
              href={tokenExplorerUrl}
              target="_blank"
              rel="noreferrer"
              className="flex h-9 items-center justify-center rounded-r-[4px] bg-white px-2 leading-none outline-none transition hover:bg-slate11"
            >
              <MagnifyingGlassIcon
                color="rgb(31 41 55)"
                className="ml-1 font-semibold"
                height={20}
                width={20}
              />
            </a>
          )}
        </div>
      </div>
      <Table color="blue">
        <Table.HeaderRow>
          <Table.HeaderCell>
            <span className="sr-only">Token Logo</span>
          </Table.HeaderCell>
          <Table.HeaderCell>Token</Table.HeaderCell>
          <Table.HeaderCell>Internal Balance</Table.HeaderCell>
          <Table.HeaderCell>Wallet Balance</Table.HeaderCell>
        </Table.HeaderRow>
        <Table.Body>
          {tokens
            .filter((token) => filterTokenInput({ tokenSearchQuery, token }))
            .sort((a, b) => (a!.value < b!.value ? 1 : -1))
            .map((token) => {
              if (token) {
                return (
                  <TokenRow
                    key={token.tokenAddress}
                    token={token}
                    operationKind={operationKind}
                    chainName={network}
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
  operationKind,
  chainName,
}: {
  token: TokenItem;
  operationKind: string;
  chainName: string;
}) {
  const router = useRouter();
  return (
    <Table.BodyRow
      key={token.tokenAddress}
      classNames="hover:bg-blue4 hover:cursor-pointer"
      onClick={() => {
        router.push(
          `/internalmanager/${chainName}/${operationKind}/token/${token.tokenAddress}`,
        );
      }}
    >
      <Table.BodyCell customWidth="w-12">
        <div className="flex items-center justify-center">
          <div className="rounded-full bg-white p-1">
            <Image
              src={
                tokenLogoUri[token.symbol as keyof typeof tokenLogoUri] ||
                genericTokenLogo
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
      <Table.BodyCell>{token.internalBalance}</Table.BodyCell>
      <Table.BodyCell>
        {token.value
          ? formatUnits(token.value, token.decimals ? token.decimals : 0)
          : ""}
      </Table.BodyCell>
    </Table.BodyRow>
  );
}
