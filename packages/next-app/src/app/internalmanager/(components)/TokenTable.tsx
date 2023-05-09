"use client";
import { InternalBalanceQuery } from "@balancer-pool-metadata/gql/src/balancer-internal-manager/__generated__/Mainnet";
import {
  MinusCircledIcon,
  PlusCircledIcon,
  WidthIcon,
} from "@radix-ui/react-icons";
import { upperFirst } from "lodash";
import Image from "next/image";
import Link from "next/link";
import { tokenLogoUri } from "public/tokens/logoUri";
import { useAccount, useNetwork } from "wagmi";

import { ToastContent } from "#/app/metadata/[network]/pool/[poolId]/(components)/MetadataAttributesTable/TransactionModal";
import genericTokenLogo from "#/assets/generic-token-logo.png";
import Table from "#/components/Table";
import { Toast } from "#/components/Toast";
import { useInternalBalance } from "#/contexts/InternalManagerContext";
import { impersonateWhetherDAO, internalBalances } from "#/lib/gql";
import { refetchRequest } from "#/utils/fetcher";
import { ArrElement, GetDeepProp } from "#/utils/getTypes";

export function TokenTable() {
  const { chain } = useNetwork();
  let { address } = useAccount();
  address = impersonateWhetherDAO(chain?.id.toString() || "1", address);

  const addressLower = address ? address?.toLowerCase() : "";

  const { notification, setIsNotifierOpen, isNotifierOpen, transactionUrl } =
    useInternalBalance();

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

  const tokensWithBalance = internalBalanceData?.user?.userInternalBalances;

  return (
    <div className="h-full flex-1 flex w-full justify-center text-white">
      {(internalBalanceData?.user === null ||
        tokensWithBalance?.length === 0) && (
        <div className="flex flex-col items-center justify-center mt-24">
          <div className="text-2xl font-semibold">No tokens found</div>
          <div className="text-sm text-gray-400 flex flex-col items-center">
            You don&apos;t have any tokens in your internal balance on{" "}
            <span>{chain?.name}, make a deposit or change the network.</span>
          </div>
        </div>
      )}
      {tokensWithBalance && tokensWithBalance?.length > 0 && (
        <Table>
          <Table.HeaderRow>
            <Table.HeaderCell>
              <span className="sr-only">Token Logo</span>
            </Table.HeaderCell>
            <Table.HeaderCell>Token</Table.HeaderCell>
            <Table.HeaderCell>Balance</Table.HeaderCell>
            <Table.HeaderCell>Manage</Table.HeaderCell>
          </Table.HeaderRow>
          <Table.Body>
            {tokensWithBalance.map((token) => (
              <TableRow
                key={token.tokenInfo.address}
                token={token}
                chainName={chain!.name}
              />
            ))}
          </Table.Body>
        </Table>
      )}
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
    </div>
  );
}

function TableRow({
  token,
  chainName,
}: {
  token: ArrElement<GetDeepProp<InternalBalanceQuery, "userInternalBalances">>;
  chainName: string;
}) {
  const network = chainName.toLowerCase();

  return (
    <Table.BodyRow key={token.tokenInfo.address}>
      <Table.BodyCell customWidth="w-12">
        <div className="flex justify-center items-center">
          <div className="bg-white rounded-full p-1">
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
          </div>
        </div>
      </Table.BodyCell>
      <Table.BodyCell>
        {token.tokenInfo.name} ({token.tokenInfo.symbol})
      </Table.BodyCell>
      <Table.BodyCell>{token.balance}</Table.BodyCell>
      <Table.BodyCell>
        <div className="flex items-center gap-2">
          {transactionButtons.map((button) => (
            <TransactionButton
              key={button.operation}
              tokenAddress={token.tokenInfo.address as `0x${string}`}
              icon={button.icon}
              operation={button.operation}
              network={network}
              disabled={button?.disabled}
            />
          ))}
        </div>
      </Table.BodyCell>
    </Table.BodyRow>
  );
}

const transactionButtons = [
  {
    icon: <PlusCircledIcon width={22} height={22} />,
    operation: "deposit",
    disabled: false,
  },
  {
    icon: <MinusCircledIcon width={22} height={22} />,
    operation: "withdraw",
  },
  {
    icon: (
      <div className="flex h-5 w-5 border-gray-500 items-center justify-center rounded-full border-[1px]">
        <WidthIcon width={16} height={16} />
      </div>
    ),
    operation: "transfer",
  },
];

function TransactionButton({
  network,
  icon,
  operation,
  disabled = false,
  tokenAddress,
}: {
  network: string;
  icon: React.ReactElement;
  operation: string;
  tokenAddress: `0x${string}`;
  disabled?: boolean;
}) {
  return (
    <>
      {!disabled ? (
        <Link
          href={`/internalmanager/${network}/${operation}/${tokenAddress}`}
          className="leading-none h-[22px] w-[22px] flex justify-center items-center"
        >
          <button
            type="button"
            title={upperFirst(operation)}
            className="leading-none"
          >
            {icon}
          </button>
        </Link>
      ) : (
        <button
          type="button"
          title={upperFirst(operation)}
          className="leading-none disabled:cursor-not-allowed disabled:text-gray-600"
          disabled={disabled}
        >
          {icon}
        </button>
      )}
    </>
  );
}
