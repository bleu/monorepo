"use client";
import { InternalBalanceQuery } from "@balancer-pool-metadata/gql/src/balancer-internal-manager/__generated__/Mainnet";
import Image from "next/image";
import { tokenLogoUri } from "public/tokens/logoUri";
import { useState } from "react";
import { useAccount, useNetwork } from "wagmi";

import genericTokenLogo from "#/assets/generic-token-logo.png";
import { Button } from "#/components";
import { Dialog } from "#/components/Dialog";
import Table from "#/components/Table";
import { impersonateWhetherDAO, internalBalances } from "#/lib/gql";
import { UserBalanceOpKind } from "#/lib/internal-balance-helper";
import { ArrElement, GetDeepProp } from "#/utils/getTypes";

import { TransactionModal } from "./(components)/TransactionModal";

export type useInternalBalancesTransactionProps = {
  token: ArrElement<GetDeepProp<InternalBalanceQuery, "userInternalBalances">>;
  userAddress: `0x${string}`;
};

export default function Page() {
  const { chain } = useNetwork();
  let { address } = useAccount();
  address = impersonateWhetherDAO(chain?.id.toString() || "1", address);

  const addressLower = address ? address?.toLowerCase() : "";

  const { data: internalBalanceData } = internalBalances
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
                  key={token.tokenInfo.address}
                  token={token}
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

function TableRow({ token, userAddress }: useInternalBalancesTransactionProps) {
  const [operationKind, setOperationKind] = useState<UserBalanceOpKind>();
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
        <Dialog
          content={
            <TransactionModal
              token={token}
              userAddress={userAddress}
              operationKind={operationKind}
            />
          }
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
  );
}
