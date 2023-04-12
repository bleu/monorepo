"use client";
import { NetworkChainId } from "@balancer-pool-metadata/shared";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";

import { ToastContent } from "#/app/metadata/[network]/pool/[poolId]/(components)/MetadataAttributesTable/TransactionModal";
import genericTokenLogo from "#/assets/generic-token-logo.png";
import { Button } from "#/components";
import Table from "#/components/Table";
import { Toast } from "#/components/Toast";
import { impersonateWhetherDAO, pools } from "#/lib/gql";
import { tokenDictionary } from "#/utils/getTokenInfo";
import { writeWithdrawInternalBalance } from "#/wagmi/withdrawInternalBalance";

enum NotificationVariant {
  NOTIFICATION = "notification",
  PENDING = "pending",
  ALERT = "alert",
  SUCCESS = "success",
}

enum TransactionStatus {
  WAITING_APPROVAL = "Waiting for your wallet approvement...",
  SUBMITTING = "The transaction is being submitted",
  CONFIRMED = "Transaction was a success",
  WRITE_ERROR = "The transaction has failed",
}

interface ITransaction {
  hash: string | undefined;
  status: TransactionStatus | undefined;
  link: string | undefined;
}

const NOTIFICATION_MAP = {
  [TransactionStatus.WAITING_APPROVAL]: {
    title: "Confirme pending... ",
    description: "Waiting for your wallet approvement",
    variant: NotificationVariant.PENDING,
  },
  [TransactionStatus.SUBMITTING]: {
    title: "Wait just a little longer",
    description: "Your transaction is being made",
    variant: NotificationVariant.NOTIFICATION,
  },
  [TransactionStatus.CONFIRMED]: {
    title: "Great!",
    description: "The transaction was a success!",
    variant: NotificationVariant.SUCCESS,
  },
  [TransactionStatus.WRITE_ERROR]: {
    title: "Error!",
    description: "the transaction has failed",
    variant: NotificationVariant.ALERT,
  },
};

interface IToken {
  symbol: string;
  token: string;
  balance: number;
  decimals: number;
}

const networkUrls = {
  [NetworkChainId.MAINNET]: "https://etherscan.io/tx/",
  [NetworkChainId.GOERLI]: "https://goerli.etherscan.io/tx/",
  [NetworkChainId.POLYGON]: "https://polygonscan.com/tx/",
  [NetworkChainId.ARBITRUM]: "https://arbiscan.io/tx/",
};

export default function Page() {
  const [isNotifierOpen, setIsNotifierOpen] = useState(false);
  const [tokensWithBalance, setTokensWithBalance] = useState<IToken[]>([]);

  const [transaction, setTransaction] = useState<ITransaction>(
    {} as ITransaction
  );
  const { chain } = useNetwork();

  let { address } = useAccount();
  address = impersonateWhetherDAO(chain?.id.toString() || "1", address);

  const addressLower = address ? address?.toLowerCase() : "";

  const handleNotifier = () => {
    if (isNotifierOpen) {
      setIsNotifierOpen(false);
      setTimeout(() => {
        setIsNotifierOpen(true);
      }, 100);
    } else {
      setIsNotifierOpen(true);
    }
  };

  async function getInternalBalances() {
    if (!addressLower) return;

    const { user } = await pools
      .gql(chain?.id.toString() || "1")
      .InternalBalance({
        userAddress: addressLower as `0x${string}`,
      });

    if (user?.userInternalBalances) {
      const tokensWithBalanceRaw = user.userInternalBalances.filter(
        (token) => token.balance > 0
      );

      const incompletedTokens: { token: string; balance: number }[] = [];
      const alreadyCompletedTokens: IToken[] = [];

      tokensWithBalanceRaw.forEach((token) => {
        if (token.token in tokenDictionary) {
          const symbol = tokenDictionary[token.token].symbol;
          const decimals = tokenDictionary[token.token].decimals;
          alreadyCompletedTokens.push({ ...token, symbol, decimals });
        } else {
          incompletedTokens.push({
            token: token.token,
            balance: token.balance,
          });
        }
      });

      const incompletedTokensAddressList = incompletedTokens.map(
        (token) => token.token
      );

      const incompletedTokensInfo = await pools
        .gql(chain?.id.toString() || "1")
        .InternalBalanceTokenInfo({
          tokenAddress: incompletedTokensAddressList,
        });

      const completedTokens: IToken[] = incompletedTokensInfo.tokens.map(
        (tokenGql) => {
          const matchingObject = incompletedTokens.find(
            (tokenBal) => tokenBal.token === tokenGql.id
          );
          if (matchingObject) {
            return {
              symbol: tokenGql.symbol as string,
              decimals: tokenGql.decimals,
              ...matchingObject,
            };
          } else
            return {
              symbol: tokenGql.symbol as string,
              decimals: tokenGql.decimals,
              token: "",
              balance: 0,
            };
        }
      );
      setTokensWithBalance([...completedTokens, ...alreadyCompletedTokens]);
    }
  }

  useEffect(() => {
    getInternalBalances();
    if (!transaction.status) return;
    handleNotifier();
  }, [transaction]);

  async function handleWithdraw(tokenAddress: `0x${string}`, balance: string) {
    setTransaction((prev) => ({
      ...prev,
      status: TransactionStatus.WAITING_APPROVAL,
    }));
    const { wait, hash } = await writeWithdrawInternalBalance(
      addressLower as `0x${string}`,
      tokenAddress,
      balance
    );
    if (hash) {
      const baseTxUrl = networkUrls[chain!.id as keyof typeof networkUrls];
      setTransaction({
        hash,
        status: TransactionStatus.SUBMITTING,
        link: `${baseTxUrl}${hash}`,
      });
    }

    try {
      const receipt = await wait();
      if (receipt.status)
        setTransaction((prev) => ({
          ...prev,
          status: TransactionStatus.CONFIRMED,
        }));
    } catch (error) {
      setTransaction((prev) => ({
        ...prev,
        status: TransactionStatus.WRITE_ERROR,
      }));
    }
  }

  return (
    <div className="h-full flex-1 flex w-full justify-center text-white">
      <div className="mt-10">
        {tokensWithBalance && tokensWithBalance?.length > 0 && (
          <Table>
            <Table.HeaderRow>
              <Table.HeaderCell>Token Logo</Table.HeaderCell>
              <Table.HeaderCell>Symbol</Table.HeaderCell>
              <Table.HeaderCell>Address</Table.HeaderCell>
              <Table.HeaderCell>Balance</Table.HeaderCell>
              <Table.HeaderCell>
                <span className="sr-only">Withdraw</span>
              </Table.HeaderCell>
            </Table.HeaderRow>
            <Table.Body>
              {tokensWithBalance.map((token) => (
                <Table.BodyRow key={token.token}>
                  <Table.BodyCell>
                    <div className="flex justify-center items-center">
                      <Image
                        src={
                          tokenDictionary[token.token]
                            ? tokenDictionary[token.token].logoURI
                              ? tokenDictionary[token.token].logoURI
                              : genericTokenLogo
                            : genericTokenLogo
                        }
                        alt="Token Logo"
                        height={28}
                        width={28}
                        quality={100}
                      />
                    </div>
                  </Table.BodyCell>
                  <Table.BodyCell>
                    {tokenDictionary[token.token]
                      ? tokenDictionary[token.token].symbol
                      : token.symbol}
                  </Table.BodyCell>
                  <Table.BodyCell>{token.token}</Table.BodyCell>
                  <Table.BodyCell>{token.balance}</Table.BodyCell>
                  <Table.BodyCell>
                    <Button
                      type="button"
                      className="bg-indigo-500 text-gray-50 hover:bg-indigo-400 focus-visible:outline-indigo-500 disabled:bg-gray-600 disabled:text-gray-500 border border-transparent"
                      onClick={() =>
                        handleWithdraw(
                          token.token as `0x${string}`,
                          String(token.balance)
                        )
                      }
                    >
                      Withdraw<span className="sr-only"> token</span>
                    </Button>
                  </Table.BodyCell>
                </Table.BodyRow>
              ))}
            </Table.Body>
          </Table>
        )}
      </div>
      {transaction.status && (
        <Toast
          content={
            <ToastContent
              title={NOTIFICATION_MAP[transaction.status].title}
              description={NOTIFICATION_MAP[transaction.status].description}
              link={transaction.link}
            />
          }
          isOpen={isNotifierOpen}
          setIsOpen={setIsNotifierOpen}
          variant={NOTIFICATION_MAP[transaction.status].variant}
        />
      )}
    </div>
  );
}
