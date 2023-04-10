"use client";
import { useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";

import { ToastContent } from "#/app/metadata/[network]/pool/[poolId]/(components)/MetadataAttributesTable/TransactionModal";
import { Button } from "#/components";
import Table from "#/components/Table";
import { Toast } from "#/components/Toast";
import { impersonateWhetherDAO, pools } from "#/lib/gql";
import { tokenDictionary } from "#/utils/getTokenInfo";
import { writeWithdrawInternalBalance } from "#/wagmi/withdrawInternalBalance";

export enum UserBalanceOpKind {
  DEPOSIT_INTERNAL,
  WITHDRAW_INTERNAL,
  TRANSFER_INTERNAL,
  TRANSFER_EXTERNAL,
}

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

const networkUrls = {
  1: "https://etherscan.io/tx/",
  5: "https://goerli.etherscan.io/tx/",
  137: "https://polygonscan.com/tx/",
  42161: "https://arbiscan.io/tx/",
};

export default function Page() {
  const [isNotifierOpen, setIsNotifierOpen] = useState(false);
  const [transaction, setTransaction] = useState<ITransaction>(
    {} as ITransaction
  );
  const { chain } = useNetwork();

  let { address } = useAccount();
  address = impersonateWhetherDAO(chain?.id.toString() || "1", address);

  const { data } = pools.gql(chain!.id.toString()).useInternalBalance({
    userAddress: address!.toLowerCase(),
  });

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

  useEffect(() => {
    if (!transaction.status) return;
    handleNotifier();
  }, [transaction]);

  async function handleWithdraw(tokenAddress: `0x${string}`, balance: string) {
    setTransaction({
      hash: undefined,
      status: TransactionStatus.WAITING_APPROVAL,
      link: undefined,
    });
    const { wait, hash } = await writeWithdrawInternalBalance(
      address!,
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
        <Table>
          <Table.HeaderRow>
            <Table.HeaderCell>Token Symbol</Table.HeaderCell>
            <Table.HeaderCell>Address</Table.HeaderCell>
            <Table.HeaderCell>Balance</Table.HeaderCell>
            <Table.HeaderCell>
              <span className="sr-only">Withdraw</span>
            </Table.HeaderCell>
          </Table.HeaderRow>
          <Table.Body>
            {data?.user?.userInternalBalances?.map((token) => (
              <>
                {token.balance > 0 && (
                  <Table.BodyRow key={token.token}>
                    <Table.BodyCell>
                      {tokenDictionary[token.token].symbol}
                    </Table.BodyCell>
                    <Table.BodyCell>{token.token}</Table.BodyCell>
                    <Table.BodyCell>{token.balance}</Table.BodyCell>
                    <Table.BodyCell>
                      <Button
                        type="button"
                        className="bg-indigo-500 text-gray-50 hover:bg-indigo-400 focus-visible:outline-indigo-500 disabled:bg-gray-600 disabled:text-gray-500 border border-transparent"
                        onClick={() =>
                          handleWithdraw(token.token, token.balance)
                        }
                      >
                        Withdraw<span className="sr-only"> token</span>
                      </Button>
                    </Table.BodyCell>
                  </Table.BodyRow>
                )}
              </>
            ))}
          </Table.Body>
        </Table>
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
