"use client";
import Image from "next/image";
import { useAccount, useNetwork } from "wagmi";

import { ToastContent } from "#/app/metadata/[network]/pool/[poolId]/(components)/MetadataAttributesTable/TransactionModal";
import genericTokenLogo from "#/assets/generic-token-logo.png";
import { Button } from "#/components";
import { Dialog } from "#/components/Dialog";
import Table from "#/components/Table";
import { Toast } from "#/components/Toast";
import { useInternalBalancesTransaction } from "#/hooks/useTransaction";
import { impersonateWhetherDAO, pools } from "#/lib/gql";
import { UserBalanceOpKind } from "#/lib/internal-balance-helper";

import { TransactionModal } from "./(components)/TransactionModal";

export default function Page() {
  const { chain } = useNetwork();
  let { address } = useAccount();
  address = impersonateWhetherDAO(chain?.id.toString() || "1", address);

  const addressLower = address ? address?.toLowerCase() : "";

  //TODO change to useInternalBalances when subgraph is updated
  //https://linear.app/bleu-llc/issue/BAL-272/fix-internal-balance-token-attribute-on-subgraph
  const { data: internalBalanceData } = pools
    .gql(chain?.id.toString() || "1")
    .useInternalBalance({
      userAddress: addressLower as `0x${string}`,
    });

  const tokensWithBalance =
    internalBalanceData?.user?.userInternalBalances?.filter(
      (token) => token.balance > 0
    );

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
                  key={token.token}
                  //TODO change to useInternalBalances when subgraph is updated
                  //https://linear.app/bleu-llc/issue/BAL-272/fix-internal-balance-token-attribute-on-subgraph
                  token={token as any}
                  userAddress={addressLower as `0x${string}`}
                />
              ))}
            </Table.Body>
          </Table>
        )}
      </div>
    </div>
  );
}

function TableRow({
  token,
  userAddress,
}: {
  //TODO change to useInternalBalances when subgraph is updated
  //https://linear.app/bleu-llc/issue/BAL-272/fix-internal-balance-token-attribute-on-subgraph
  token: any;
  userAddress: `0x${string}`;
}) {
  const {
    transactionUrl,
    operationKind,
    setOperationKind,
    isNotifierOpen,
    setIsNotifierOpen,
    notification,
  } = useInternalBalancesTransaction({
    userAddress,
    token,
  });

  return (
    <>
      <Table.BodyRow key={token.token}>
        <Table.BodyCell>
          <div className="flex justify-center items-center">
            <Image
              src={genericTokenLogo}
              alt="Token Logo"
              height={28}
              width={28}
              quality={100}
            />
          </div>
        </Table.BodyCell>
        <Table.BodyCell>{"token.tokenInfo.symbol"}</Table.BodyCell>
        <Table.BodyCell>{token.token}</Table.BodyCell>
        <Table.BodyCell>{token.balance}</Table.BodyCell>
        <Table.BodyCell>
          <Dialog
            content={<TransactionModal operationKind={operationKind} />}
            isBig={true}
          >
            <Button
              type="button"
              className="bg-indigo-500 text-gray-50 hover:bg-indigo-400 focus-visible:outline-indigo-500 disabled:bg-gray-600 disabled:text-gray-500 border border-transparent"
              onClick={() => {
                setOperationKind(UserBalanceOpKind.WITHDRAW_INTERNAL);
              }}
            >
              Withdraw<span className="sr-only"> token</span>
            </Button>
          </Dialog>
        </Table.BodyCell>
      </Table.BodyRow>
      {notification && (
        <Toast
          content={
            <ToastContent
              title={notification.title}
              description={notification.description}
              link={transactionUrl}
            />
          }
          isOpen={isNotifierOpen}
          setIsOpen={setIsNotifierOpen}
          variant={notification.variant}
        />
      )}
    </>
  );
}
