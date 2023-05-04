"use client";

import { ChevronDownIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";

import genericTokenLogo from "#/assets/generic-token-logo.png";
import { Dialog } from "#/components/Dialog";
import { Input } from "#/components/Input";
import Table from "#/components/Table";
import {
  SelectedToken,
  useInternalBalance,
} from "#/contexts/InternalManagerContext";
import { impersonateWhetherDAO, internalBalances } from "#/lib/gql";
import { moralisGetTokens } from "#/lib/moralis";
import { refetchRequest } from "#/utils/fetcher";

interface tokenItem {
  token_address: string;
  name: string;
  symbol: string;
  logo?: string | undefined;
  thumbnail?: string | undefined;
  decimals: number;
  balance: string;
  possible_spam: boolean;
  internalBalance?: string;
}

export function TokenSelect() {
  const { selectedToken, setSelectedToken } = useInternalBalance();

  const handleSelectToken = (token: SelectedToken) => {
    setSelectedToken(token);
  };

  return (
    <Dialog
      content={<TokenModal handleSelectToken={handleSelectToken} />}
      customWidth="w-8/12"
      hasNoPadding
    >
      <div className="flex flex-col">
        <span className="mb-2 block text-sm text-slate12">Token</span>
        <button
          type="button"
          className="flex items-center gap-2 py-1 px-2w-full justify-between w-full selection:color-white box-border h-[35px] appearance-none rounded-[4px] bg-blue4 px-[10px] text-[15px] leading-none text-slate12 shadow-[0_0_0_1px] shadow-blue6 outline-none selection:bg-blue9 hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black] disabled:bg-blue1"
        >
          <div className="flex items-center gap-1">
            <Image
              src={genericTokenLogo}
              className="rounded-full"
              alt="Token Logo"
              height={28}
              width={28}
              quality={100}
            />
            <div>{selectedToken?.symbol}</div>
          </div>
          <ChevronDownIcon />
        </button>
      </div>
    </Dialog>
  );
}

function TokenModal({
  handleSelectToken,
  close,
}: {
  handleSelectToken: (token: SelectedToken) => void;
  close?: () => void;
}) {
  const [tokenSearch, setTokenSearch] = useState<string>();
  const { chain } = useNetwork();
  let { address } = useAccount();
  address = impersonateWhetherDAO(chain?.id.toString() || "1", address);
  const [tokens, setTokens] = useState<(tokenItem | undefined)[]>([]);

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

  useEffect(() => {
    moralisGetTokens({
      userAddress: addressLower,
      chain: chain!.name as "Goerli",
    }).then((res) => {
      setTokens([]);
      res.forEach((token) => {
        const internalBalance =
          internalBalanceData?.user?.userInternalBalances?.find(
            (internalBalanceInfo) =>
              internalBalanceInfo.tokenInfo.address === token.token_address
          );

        if (internalBalance) {
          setTokens((prev) => [
            ...prev,
            {
              ...token,
              balance: (
                Number(token.balance) / Math.pow(10, token.decimals)
              ).toFixed(token.decimals),
              internalBalance: internalBalance.balance,
            },
          ]);
        }
      });
    });
  }, [internalBalanceData]);

  return (
    <div className="text-white divide-y divide-gray-700">
      <div className="w-full flex flex-col justify-center items-center h-full py-4 gap-y-4">
        <div className="text-xl">Token Search</div>
        <div className="w-full px-10">
          <Input
            type="text"
            placeholder={"Search name or paste address"}
            value={tokenSearch}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTokenSearch(e.target.value)
            }
          />
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
          {tokens.map((token) => {
            if (token) {
              return (
                <Table.BodyRow key={token.token_address}>
                  <Table.BodyCell customWidth="w-12">
                    <button
                      type="button"
                      onClick={() => {
                        handleSelectToken({
                          address: token.token_address,
                          symbol: token.symbol,
                          logoUrl: token.logo,
                        });
                        close?.();
                      }}
                    >
                      <div className="flex justify-center items-center">
                        <div className="bg-white rounded-full p-1">
                          <Image
                            src={token.logo || genericTokenLogo}
                            className="rounded-full"
                            alt="Token Logo"
                            height={28}
                            width={28}
                            quality={100}
                          />
                        </div>
                      </div>
                    </button>
                  </Table.BodyCell>
                  <Table.BodyCell>
                    <button
                      type="button"
                      onClick={() => {
                        handleSelectToken({
                          address: token.token_address,
                          symbol: token.symbol,
                          logoUrl: token.logo,
                        });
                        close?.();
                      }}
                    >
                      {token.name} ({token.symbol})
                    </button>
                  </Table.BodyCell>
                  <Table.BodyCell>
                    <button
                      type="button"
                      onClick={() => {
                        handleSelectToken({
                          address: token.token_address,
                          symbol: token.symbol,
                          logoUrl: token.logo,
                        });
                        close?.();
                      }}
                    >
                      {token.internalBalance}
                    </button>
                  </Table.BodyCell>
                  <Table.BodyCell>
                    <button
                      type="button"
                      onClick={() => {
                        handleSelectToken({
                          address: token.token_address,
                          symbol: token.symbol,
                          logoUrl: token.logo,
                        });
                        close?.();
                      }}
                    >
                      {token.balance}
                    </button>
                  </Table.BodyCell>
                </Table.BodyRow>
              );
            }
          })}
        </Table.Body>
      </Table>
    </div>
  );
}
