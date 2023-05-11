"use client";

import { SingleInternalBalanceQuery } from "@balancer-pool-metadata/gql/src/balancer-internal-manager/__generated__/Mainnet";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { fetchBalance, FetchBalanceResult } from "@wagmi/core";
import Image from "next/image";
import Link from "next/link";
import { tokenLogoUri } from "public/tokens/logoUri";
import React, { useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";

import genericTokenLogo from "#/assets/generic-token-logo.png";
import { Dialog } from "#/components/Dialog";
import Table from "#/components/Table";
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

  const addressLower = address ? address?.toLowerCase() : "";

  const { data: internalBalanceData, mutate } = internalBalances
    .gql(chain?.id.toString() || "1")
    .useInternalBalance({
      userAddress: addressLower as `0x${string}`,
    });

  refetchRequest({
    mutate,
    chainId: chain?.id.toString() || "1",
    userAddress: addressLower as `0x${string}`,
  });

  const internalBalancesTokenAdresses = internalBalanceData?.user
    ?.userInternalBalances
    ? internalBalanceData.user.userInternalBalances.map(
        (token) => token.tokenInfo.address
      )
    : [];

  async function getWalletBalance(
    internalBalancesTokenAdresses: `0x${string}`[]
  ) {
    const walletBalanceData: TokenWalletBalance[] = [];
    const walletBalancePromises = internalBalancesTokenAdresses.map(
      async (tokenAddress) => {
        const tokenData = await fetchBalance({
          address: addressLower as `0x${string}`,
          token: tokenAddress,
        });
        walletBalanceData.push({
          ...tokenData,
          tokenAddress: tokenAddress,
        });
      }
    );
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
        }
      });
    }
  }

  useEffect(() => {
    if (!internalBalanceData?.user?.userInternalBalances) return;
    getWalletBalance(internalBalancesTokenAdresses as `0x${string}`[]);
  }, [internalBalanceData]);

  return (
    <div className="text-white divide-y divide-gray-700">
      <div className="w-full flex flex-col justify-center items-center h-full py-4 gap-y-4">
        <div className="text-xl">Token Search</div>
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
          {tokens.map((token) => {
            if (token) {
              return (
                <TokenRow
                  token={token}
                  operationKind={operationKind}
                  close={close}
                  chainName={chain!.name.toLowerCase()}
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
