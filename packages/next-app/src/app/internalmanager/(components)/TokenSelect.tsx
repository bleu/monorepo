"use client";

import { SingleInternalBalanceQuery } from "@balancer-pool-metadata/gql/src/balancer-internal-manager/__generated__/Ethereum";
import {
  Address,
  addressRegex,
  buildBlockExplorerTokenURL,
} from "@balancer-pool-metadata/shared";
import { ChevronDownIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { fetchBalance, FetchBalanceResult } from "@wagmi/core";
import Image from "next/image";
import Link from "next/link";
import { tokenLogoUri } from "public/tokens/logoUri";
import React, { useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";

import genericTokenLogo from "#/assets/generic-token-logo.png";
import { Dialog } from "#/components/Dialog";
import Table from "#/components/Table";
import { useInternalBalance } from "#/contexts/InternalManagerContext";
import { getNetwork } from "#/contexts/networks";
import { impersonateWhetherDAO, internalBalances } from "#/lib/gql";
import { refetchRequest } from "#/utils/fetcher";
import { ArrElement, GetDeepProp } from "#/utils/getTypes";

interface TokenWalletBalance extends FetchBalanceResult {
  tokenAddress: string;
}

interface TokenItem extends TokenWalletBalance {
  name?: string | null;
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
          className="flex items-center gap-2 py-1 px-2w-full justify-between w-full selection:color-white box-border h-[35px] appearance-none rounded-[4px] bg-blue4 px-[10px] text-[15px] leading-none text-slate12 shadow-[0_0_0_1px] shadow-blue6 outline-none selection:bg-blue9 hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black] disabled:bg-blue1"
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
              height={28}
              width={28}
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
  close,
  operationKind,
}: {
  close?: () => void;
  operationKind: string;
}) {
  const { chain } = useNetwork();
  let { address } = useAccount();
  address = impersonateWhetherDAO(chain?.id.toString() || "1", address);
  const [tokens, setTokens] = useState<(TokenItem | undefined)[]>([]);
  const [tokenSearch, setTokenSearch] = useState("");
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
        token.tokenInfo.address.toLowerCase()
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
    const walletBalanceData: TokenWalletBalance[] = [];
    const walletBalancePromises = tokenAdresses.map(async (tokenAddress) => {
      const tokenData = await fetchSingleTokenBalance({ tokenAddress });
      walletBalanceData.push({
        ...tokenData,
        tokenAddress: tokenAddress,
      });
    });
    await Promise.all(walletBalancePromises);
    if (walletBalanceData) {
      setTokens([]);
      walletBalanceData.forEach((token) => {
        const internalBalance =
          internalBalanceData?.user?.userInternalBalances?.find(
            (internalBalanceInfo) =>
              internalBalanceInfo.tokenInfo.address === token.tokenAddress
          );

        if (internalBalance) {
          setTokens((prev) => [
            ...prev,
            {
              ...token,
              internalBalance: internalBalance.balance,
              name: internalBalance.tokenInfo.name,
            },
          ]);
        } else {
          setTokens((prev) => [
            ...prev,
            {
              ...token,
              name: token.symbol,
            },
          ]);
        }
      });
    }
  }

  const tokenExplorerUrl = buildBlockExplorerTokenURL({
    chainId: chain?.id,
    tokenAddress: tokenSearch.toLowerCase() as Address,
  });

  useEffect(() => {
    if (!internalBalanceData?.user?.userInternalBalances) return;
    getWalletBalance(tokenAdresses as Address[]);
  }, [internalBalanceData]);

  const network = getNetwork(chain?.name);
  useEffect(() => {
    if (!addressRegex.test(tokenSearch)) {
      setIsTokenSearchDisabled(true);
      return;
    }
    setIsTokenSearchDisabled(false);
    if (!tokens.some((token) => filterTokenInput({ tokenSearch, token }))) {
      fetchSingleTokenBalance({
        tokenAddress: tokenSearch.toLowerCase() as Address,
      }).then((tokenData) => {
        setTokens((prev) => [
          ...prev,
          {
            ...tokenData,
            name: tokenData.symbol,
            tokenAddress: tokenSearch.toLowerCase() as Address,
          },
        ]);
      });
    }
  }, [tokenSearch]);

  function filterTokenInput({
    tokenSearch,
    token,
  }: {
    tokenSearch: string;
    token?: TokenItem;
  }) {
    {
      if (!token) return false;
      const regex = new RegExp(tokenSearch, "i");
      return regex.test(Object.values(token).join(","));
    }
  }

  return (
    <div className="text-white divide-y divide-gray-700 max-h-[30rem] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-blue3">
      <div className="w-full flex flex-col justify-center items-center h-full py-4 gap-y-4">
        <div className="text-xl">Token Search</div>
        <div className="w-full px-10 flex items-center">
          <input
            type="text"
            placeholder="Search name or paste address"
            className="bg-blue4 h-9 w-full appearance-none items-center justify-center rounded-l-[4px] px-[10px] text-sm leading-none text-slate12 outline-none"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTokenSearch(e.target.value)
            }
            value={tokenSearch}
          />
          {isTokenSearchDisabled ? (
            <button
              className="h-9 rounded-r-[4px] bg-gray-200 px-2 leading-none outline-none transition hover:bg-gray-300 disabled:cursor-not-allowed"
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
              className="h-9 rounded-r-[4px] bg-white px-2 leading-none outline-none transition hover:bg-gray-300 flex justify-center items-center"
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
            .filter((token) => filterTokenInput({ tokenSearch, token }))
            .sort((a, b) => (a!.value < b!.value ? 1 : -1))
            .map((token) => {
              if (token) {
                return (
                  <TokenRow
                    key={token.tokenAddress}
                    token={token}
                    operationKind={operationKind}
                    close={close}
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
  close,
  chainName,
}: {
  token: TokenItem;
  operationKind: string;
  close?: () => void;
  chainName: string;
}) {
  return (
    <Table.BodyRow key={token.tokenAddress}>
      <Table.BodyCell customWidth="w-12">
        <Link
          href={`/internalmanager/${chainName}/${operationKind}/${token.tokenAddress}`}
        >
          <button
            type="button"
            onClick={() => {
              close?.();
            }}
          >
            <div className="flex justify-center items-center">
              <div className="bg-white rounded-full p-1">
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
          </button>
        </Link>
      </Table.BodyCell>
      <Table.BodyCell>
        <Link
          href={`/internalmanager/${chainName}/${operationKind}/${token.tokenAddress}`}
        >
          <button
            type="button"
            onClick={() => {
              close?.();
            }}
          >
            {token.name} ({token.symbol})
          </button>
        </Link>
      </Table.BodyCell>
      <Table.BodyCell>
        <Link
          href={`/internalmanager/${chainName}/${operationKind}/${token.tokenAddress}`}
        >
          <button
            type="button"
            onClick={() => {
              close?.();
            }}
          >
            {token.internalBalance}
          </button>
        </Link>
      </Table.BodyCell>
      <Table.BodyCell>
        <Link
          href={`/internalmanager/${chainName}/${operationKind}/${token.tokenAddress}`}
        >
          <button
            type="button"
            onClick={() => {
              close?.();
            }}
          >
            {token.formatted}
          </button>
        </Link>
      </Table.BodyCell>
    </Table.BodyRow>
  );
}
