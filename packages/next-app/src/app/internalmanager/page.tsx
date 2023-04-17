"use client";
import { InternalBalanceQuery } from "@balancer-pool-metadata/gql/src/balancer-internal-manager/__generated__/Mainnet";
import { NetworkChainId } from "@balancer-pool-metadata/shared";
import { parseFixed } from "@ethersproject/bignumber";
import Image from "next/image";
import { tokenLogoUri } from "public/tokens/logoUri";
import { useEffect, useState } from "react";
import { Chain, useAccount, useNetwork, useWaitForTransaction } from "wagmi";

import { ToastContent } from "#/app/metadata/[network]/pool/[poolId]/(components)/MetadataAttributesTable/TransactionModal";
import genericTokenLogo from "#/assets/generic-token-logo.png";
import { Button } from "#/components";
import Table from "#/components/Table";
import { Toast } from "#/components/Toast";
import { impersonateWhetherDAO, internalBalances } from "#/lib/gql";
import { UserBalanceOpKind } from "#/lib/internal-balance-helper";
import { ArrElement, GetDeepProp } from "#/utils/getTypes";
import {
  usePrepareVaultManageUserBalance,
  useVaultManageUserBalance,
} from "#/wagmi/generated";

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
  [NetworkChainId.MAINNET]: "https://etherscan.io/tx/",
  [NetworkChainId.GOERLI]: "https://goerli.etherscan.io/tx/",
  [NetworkChainId.POLYGON]: "https://polygonscan.com/tx/",
  [NetworkChainId.ARBITRUM]: "https://arbiscan.io/tx/",
};

export default function Page() {
  const [isNotifierOpen, setIsNotifierOpen] = useState(false);
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
  const { data } = internalBalances
    .gql(chain?.id.toString() || "1")
    .useInternalBalance({
      userAddress: addressLower as `0x${string}`,
    });

  const tokensWithBalance = data?.user?.userInternalBalances?.filter(
    (token) => token.balance > 0
  );

  useEffect(() => {
    if (!transaction.status) return;
    handleNotifier();
  }, [transaction]);

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
                <TableRow
                  key={token.tokenInfo.address}
                  token={token}
                  userAddress={addressLower as `0x${string}`}
                  setTransaction={setTransaction}
                  chain={chain}
                />
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

function TableRow({
  token,
  userAddress,
  setTransaction,
  chain,
}: {
  token: ArrElement<GetDeepProp<InternalBalanceQuery, "userInternalBalances">>;
  userAddress: `0x${string}`;
  setTransaction: React.Dispatch<React.SetStateAction<ITransaction>>;
  chain?: Chain;
}) {
  const [operationKind, setOperationKind] = useState<UserBalanceOpKind>();
  const userBalanceOp = {
    kind: operationKind as number,
    asset: token.tokenInfo.address as `0x${string}`,
    amount: parseFixed(token.balance, token.tokenInfo.decimals),
    sender: userAddress as `0x${string}`,
    recipient: userAddress as `0x${string}`,
  };
  const { config } = usePrepareVaultManageUserBalance({
    args: [[userBalanceOp]],
  });
  const { data, write } = useVaultManageUserBalance(config);

  useWaitForTransaction({
    hash: data?.hash,
    onSuccess() {
      setTransaction((prev) => ({
        ...prev,
        status: TransactionStatus.CONFIRMED,
      }));
    },
    onError() {
      setTransaction((prev) => ({
        ...prev,
        status: TransactionStatus.WRITE_ERROR,
      }));
    },
  });

  function handleWithdraw() {
    setOperationKind(UserBalanceOpKind.WITHDRAW_INTERNAL);
    setTransaction((prev) => ({
      ...prev,
      status: TransactionStatus.WAITING_APPROVAL,
    }));
  }

  useEffect(() => {
    if (!data) return;
    const { hash } = data;
    async function handleTransactionStatus() {
      if (!hash || !chain) return;
      const baseTxUrl = networkUrls[chain.id as keyof typeof networkUrls];
      setTransaction({
        hash,
        status: TransactionStatus.SUBMITTING,
        link: `${baseTxUrl}${hash}`,
      });
    }
    switch (operationKind) {
      case UserBalanceOpKind.WITHDRAW_INTERNAL: {
        handleTransactionStatus();
      }
      default:
        return;
    }
  }, [data]);

  useEffect(() => {
    if (!operationKind) return;
    write?.();
  }, [operationKind]);

  return (
    <Table.BodyRow key={token.tokenInfo.address}>
      <Table.BodyCell>
        <div className="flex justify-center items-center">
          <Image
            src={
              tokenLogoUri[
                token?.tokenInfo?.symbol as keyof typeof tokenLogoUri
              ] || genericTokenLogo
            }
            alt="Token Logo"
            height={28}
            width={28}
            quality={100}
          />
        </div>
      </Table.BodyCell>
      <Table.BodyCell>{token.tokenInfo.symbol}</Table.BodyCell>
      <Table.BodyCell>{token.tokenInfo.address}</Table.BodyCell>
      <Table.BodyCell>{token.balance}</Table.BodyCell>
      <Table.BodyCell>
        <Button
          type="button"
          className="bg-indigo-500 text-gray-50 hover:bg-indigo-400 focus-visible:outline-indigo-500 disabled:bg-gray-600 disabled:text-gray-500 border border-transparent"
          onClick={() => handleWithdraw()}
        >
          Withdraw<span className="sr-only"> token</span>
        </Button>
      </Table.BodyCell>
    </Table.BodyRow>
  );
}
